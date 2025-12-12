import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { UTApi, UTFile } from "uploadthing/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
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
                kernel: sharp.kernel.lanczos3,
            })
            .rotate()
            .withMetadata({
                exif: {},
                icc: undefined,
            });

        const { data: optimizedBuffer } = await sharpInstance
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

        const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN?.trim() });
        const utFile = new UTFile([byteArray], "flashcard-image.webp", { type: "image/webp" });

        const uploadResponse = await utapi.uploadFiles([utFile]);

        if (!uploadResponse[0] || uploadResponse[0].error) {
            return NextResponse.json({ error: uploadResponse[0]?.error?.message || "Upload failed" }, { status: 500 });
        }

        const uploadedData = uploadResponse[0].data;

        return NextResponse.json({
            success: true,
            url: uploadedData.ufsUrl,
        });
    } catch (error) {
        console.error("Error uploading flashcard image:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
