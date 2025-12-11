import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { UTApi, UTFile } from "uploadthing/server";
import { db } from "@/db/drizzle";
import { processedImages } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const rawUrl = searchParams.get("url");

        if (!rawUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }


        let pixabayId: string | null = null;

        const idMatch = rawUrl.match(/[?&]pixabayId=([^&]+)/);
        if (idMatch) {
            pixabayId = idMatch[1];
        }

        const [inserted] = await db.insert(processedImages)
            .values({
                originalUrl: rawUrl, // Store exactly what was requested
            })
            .onConflictDoNothing()
            .returning();

        if (!inserted) {
            const existingImage = await db.query.processedImages.findFirst({
                where: eq(processedImages.originalUrl, rawUrl),
            });

            if (existingImage?.optimizedUrl) {

                return NextResponse.json({
                    success: true,
                    originalUrl: existingImage.originalUrl,
                    optimizedUrl: existingImage.optimizedUrl,
                    recordId: existingImage.id,
                    width: existingImage.width,
                    height: existingImage.height,
                    cached: true,
                }, {
                    headers: {
                        "Cache-Control": "public, max-age=31536000, immutable"
                    }
                });
            }
        }

        const recordId = inserted?.id || (await db.query.processedImages.findFirst({
            where: eq(processedImages.originalUrl, rawUrl)
        }))?.id;

        if (!recordId) throw new Error("Could not retrieve record ID");


        let fetchUrl = rawUrl.split("?pixabayId=")[0];

        try {
            let response = await fetch(fetchUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Referer": "https://pixabay.com/",
                    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
                }
            });

            if (!response.ok && pixabayId) {
                console.log(`[Auto-Heal] Original fetch failed (${response.status}). Attempting to recover using Pixabay ID: ${pixabayId}`);

                const apiKey = process.env.PIXABAY_API_KEY;
                if (apiKey) {
                    const cleanId = pixabayId.trim();
                    const pixabayApiUrl = `https://pixabay.com/api/?key=${apiKey}&id=${cleanId}`;

                    const pixabayRes = await fetch(pixabayApiUrl);
                    if (pixabayRes.ok) {
                        const data = await pixabayRes.json();
                        if (data.hits && data.hits.length > 0) {
                            const newUrl = data.hits[0].largeImageURL;
                            console.log(`[Auto-Heal] Recovered new URL: ${newUrl}`);
                            fetchUrl = newUrl;

                            response = await fetch(fetchUrl, {
                                headers: {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                                    "Referer": "https://pixabay.com/",
                                    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
                                }
                            });
                        }
                    }
                }
            }

            if (!response.ok) {
                const errorText = await response.text().catch(() => "No error text");
                throw new Error(`Failed to fetch image: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const metadata = await sharp(buffer).metadata();

            let maxWidth = 1200;
            if (metadata.width && metadata.width < 1200) {
                maxWidth = metadata.width;
            }

            const sharpInstance = sharp(buffer)
                .resize(maxWidth, null, {
                    fit: "inside",
                    withoutEnlargement: true,
                    kernel: sharp.kernel.lanczos3
                })
                .rotate()
                .withMetadata({
                    exif: {},
                    icc: undefined,
                });

            const { data: optimizedBuffer, info } = await sharpInstance
                .webp({
                    quality: 75,
                    alphaQuality: 80,
                    lossless: false,
                    nearLossless: false,
                    smartSubsample: true,
                    effort: 6,
                    preset: "photo",
                })
                .toBuffer({ resolveWithObject: true });

            const byteArray = new Uint8Array(optimizedBuffer);

            const originalSize = buffer.length;
            const optimizedSize = optimizedBuffer.length;
            const compressionRatio = ((1 - optimizedSize / originalSize) * 100).toFixed(2);

            const utapi = new UTApi();
            const file = new UTFile([byteArray], "optimized-image.webp", { type: "image/webp" });

            const uploadResponse = await utapi.uploadFiles([file]);

            if (!uploadResponse[0] || uploadResponse[0].error) {
                throw new Error("Failed to upload: " + uploadResponse[0].error?.message);
            }

            const uploadedData = uploadResponse[0].data;


            const [updatedRecord] = await db.update(processedImages)
                .set({
                    optimizedUrl: uploadedData.url,
                    width: info.width,
                    height: info.height,
                })
                .where(eq(processedImages.id, recordId))
                .returning();

            return NextResponse.json({
                success: true,
                originalUrl: rawUrl,
                optimizedUrl: uploadedData.url,
                recordId: updatedRecord.id,
                width: info.width,
                height: info.height,
                optimization: {
                    originalSize,
                    optimizedSize,
                    compressionRatio: `${compressionRatio}%`,
                    format: info.format
                }
            }, {
                headers: {
                    "Cache-Control": "public, max-age=31536000, immutable"
                }
            });

        } catch (processError) {
            await db.delete(processedImages).where(eq(processedImages.id, recordId));
            throw processError;
        }

    } catch (error) {
        console.error("Error processing image:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
