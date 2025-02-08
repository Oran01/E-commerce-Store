import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { notFound } from "next/navigation";

/**
 * Handles GET requests to download a product file.
 *
 * This function retrieves the requested product file from the database, reads it from the file system,
 * and serves it as a downloadable attachment.
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.id - The unique identifier of the product to be downloaded.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  // Retrieve product information from the database
  const product = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  });

  if (product == null) return notFound(); // Return 404 if product is not found

  const { size } = await fs.stat(product.filePath);
  const file = await fs.readFile(product.filePath);
  const extension = product.filePath.split(".").pop(); // Extract file extension

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
      "content-Length": size.toString(),
    },
  });
}
