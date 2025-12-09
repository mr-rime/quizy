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
        const imageUrl = searchParams.get("url");

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }

        const [inserted] = await db.insert(processedImages)
            .values({
                originalUrl: imageUrl,
            })
            .onConflictDoNothing()
            .returning();

        if (!inserted) {
            const existingImage = await db.query.processedImages.findFirst({
                where: eq(processedImages.originalUrl, imageUrl),
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
                });
            } else {
                return NextResponse.json({
                    success: true,
                    originalUrl: imageUrl,
                    optimizedUrl: null,
                    recordId: existingImage?.id,
                    cached: false,
                });
            }
        }

        try {
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const { data: optimizedBuffer, info } = await sharp(buffer)
                .resize(800)
                .webp()
                .toBuffer({ resolveWithObject: true });

            const byteArray = new Uint8Array(optimizedBuffer);


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
                .where(eq(processedImages.id, inserted.id))
                .returning();

            return NextResponse.json({
                success: true,
                originalUrl: imageUrl,
                optimizedUrl: uploadedData.url,
                recordId: updatedRecord.id,
                width: info.width,
                height: info.height
            });

        } catch (processError) {
            await db.delete(processedImages).where(eq(processedImages.id, inserted.id));
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
