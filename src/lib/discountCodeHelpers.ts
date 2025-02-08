import db from "@/db/db";
import { DiscountCodeType, Prisma } from "@prisma/client";

/**
 * Generates a Prisma filter condition to find usable discount codes for a given product.
 *
 * @param {string} productId - The ID of the product for which the discount code is being checked.
 */
export function usableDiscountCodeWhere(productId: string) {
  return {
    isActive: true,
    AND: [
      {
        OR: [{ allProducts: true }, { products: { some: { id: productId } } }],
      },
      {
        OR: [{ limit: null }, { limit: { gt: db.discountCode.fields.uses } }],
      },
      {
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    ],
  } satisfies Prisma.DiscountCodeWhereInput;
}

/**
 * Calculates the discounted price based on the discount type and amount.
 *
 * @param {Object} discountCode - The discount code information.
 * @param {number} discountCode.discountAmount - The discount amount applied.
 * @param {DiscountCodeType} discountCode.discountType - The type of discount (percentage or fixed).
 * @param {number} priceInCents - The original product price in cents.
 */
export function getDiscountedAmount(
  discountCode: { discountAmount: number; discountType: DiscountCodeType },
  priceInCents: number
) {
  switch (discountCode.discountType) {
    case "PERCENTAGE":
      return Math.max(
        1,
        Math.ceil(
          priceInCents - (priceInCents * discountCode.discountAmount) / 100
        )
      );
    case "FIXED":
      return Math.max(
        1,
        Math.ceil(priceInCents - discountCode.discountAmount * 100)
      );
    default:
      throw new Error(
        `Invalid discount type ${discountCode.discountType satisfies never}`
      );
  }
}
