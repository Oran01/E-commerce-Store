"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * Schema validation for product file upload.
 */
const fileSchema = z.instanceof(File, { message: "Required" });

/**
 * Schema validation for product image upload.
 * Ensures the file is an image or empty.
 */
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

/**
 * Schema validation for adding a product.
 */
const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

/**
 * Adds a new product to the database.
 *
 * @async
 * @function addProduct
 * @param {unknown} prevState - Previous state (not used).
 * @param {FormData} formData - Form data containing product details.
 */
export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    `public/${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

/**
 * Schema validation for editing a product.
 */
const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

/**
 * Updates an existing product in the database.
 *
 * @async
 * @function updateProduct
 * @param {string} id - The product ID.
 * @param {unknown} prevState - Previous state (not used).
 * @param {FormData} formData - Form data containing updated product details.
 */
export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await db.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  let filePath = product.filePath;
  if (data.file != null && data.file.size > 0) {
    await fs.unlink(product.filePath);
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
  }

  let imagePath = product.imagePath;
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public/${product.imagePath}`);
    imagePath = `products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public/${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

/**
 * Toggles the availability of a product for purchase.
 *
 * @async
 * @function toggleProductAvailability
 * @param {string} id - The product ID.
 * @param {boolean} isAvailableForPurchase - The new availability state.
 */
export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } });

  revalidatePath("/");
  revalidatePath("/products");
}

/**
 * Deletes a product from the database and removes associated files.
 *
 * @async
 * @function deleteProduct
 * @param {string} id - The product ID.
 * @throws {Error} If the product does not exist.
 */
export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });
  if (product == null) return notFound();

  await fs.unlink(product.filePath);
  await fs.unlink(`public/${product.imagePath}`);

  revalidatePath("/");
  revalidatePath("/products");
}
