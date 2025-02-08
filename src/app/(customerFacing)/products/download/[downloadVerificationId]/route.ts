import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

/**
 * Handles the GET request for downloading a product file.
 *
 * @param {NextRequest} req - The request object containing the request details.
 * @param {Object} params - The route parameters.
 * @param {string} params.downloadVerificationId - The unique ID for verifying the download request.
 */
export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  // Retrieve the download verification entry from the database
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expireAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  });

  // Redirect if the download verification is not found or expired
  if (data == null) {
    return NextResponse.redirect(
      new URL("/products/download/expired", req.url)
    );
  }

  // Retrieve file details and content
  const { size } = await fs.stat(data.product.filePath);
  const file = await fs.readFile(data.product.filePath);
  const extension = data.product.filePath.split(".").pop();

  // Return the file as a response with appropriate headers for download
  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
      "content-Length": size.toString(),
    },
  });
}
