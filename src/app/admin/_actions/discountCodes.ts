"use server";

import db from "@/db/db";
import { DiscountCodeType } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

/**
 * Zod schema for validating discount code form data.
 *
 * This schema enforces the following rules:
 * - `code`: Required string, must have at least 1 character.
 * - `discountAmount`: Required integer, must be at least 1.
 * - `discountType`: Must be one of the values from `DiscountCodeType` enum.
 * - `allProducts`: Boolean flag indicating if the discount applies to all products.
 * - `productIds`: Optional array of product IDs (only if `allProducts` is false).
 * - `expiresAt`: Optional date, must be a valid future date or omitted.
 * - `limit`: Optional integer, must be at least 1 if provided.
 *
 * Additional constraints:
 * - Percentage discount codes (`PERCENTAGE`) cannot exceed 100%.
 * - If `allProducts` is true, `productIds` must be null.
 * - If `allProducts` is false, `productIds` must be provided.
 */
const addSchema = z
  .object({
    code: z.string().min(1),
    discountAmount: z.coerce.number().int().min(1),
    discountType: z.nativeEnum(DiscountCodeType),
    allProducts: z.coerce.boolean(),
    productIds: z.array(z.string()).optional(),
    expiresAt: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.date().min(new Date()).optional()
    ),
    limit: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().int().min(1).optional()
    ),
  })
  .refine(
    (data) =>
      data.discountAmount <= 100 ||
      data.discountType != DiscountCodeType.PERCENTAGE,
    {
      message: "Percentage discount must be less than or equal 100",
      path: ["discountAmount"],
    }
  )
  .refine((data) => !data.allProducts || data.productIds == null, {
    message: "Cannot select products when all products is selected",
    path: ["productsIds"],
  })
  .refine((data) => data.allProducts || data.productIds != null, {
    message: "Must select products when all products is not selected",
    path: ["productsIds"],
  });

/**
 * Adds a new discount code to the database.
 *
 * @async
 * @function addDiscountCode
 * @param {unknown} prevState - The previous state (not used in this function).
 * @param {FormData} formData - The form data containing discount code details.
 */
export async function addDiscountCode(prevState: unknown, formData: FormData) {
  const productIds = formData.getAll("productIds");
  const result = addSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    productIds: productIds.length > 0 ? productIds : undefined,
  });

  if (result.success == false) return result.error.formErrors.fieldErrors;

  const data = result.data;

  await db.discountCode.create({
    data: {
      code: data.code,
      discountAmount: data.discountAmount,
      discountType: data.discountType,
      allProducts: data.allProducts,
      products:
        data.productIds != null
          ? { connect: data.productIds.map((id) => ({ id })) }
          : undefined,
      expiresAt: data.expiresAt,
      limit: data.limit,
    },
  });

  redirect("/admin/discount-codes");
}

/**
 * Toggles the active status of a discount code.
 *
 * @async
 * @function toggleDiscountCodeActive
 * @param {string} id - The ID of the discount code.
 * @param {boolean} isActive - The new active status.
 */
export async function toggleDiscountCodeActive(id: string, isActive: boolean) {
  await db.discountCode.update({ where: { id }, data: { isActive } });
}

/**
 * Deletes a discount code from the database.
 *
 * @async
 * @function deleteDiscountCode
 * @param {string} id - The ID of the discount code to delete.
 */
export async function deleteDiscountCode(id: string) {
  const discountCode = await db.discountCode.delete({ where: { id } });

  if (discountCode == null) return notFound();

  return discountCode;
}
