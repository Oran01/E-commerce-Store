import { DiscountCodeType } from "@prisma/client";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 0,
});

/**
 * Formats a number as a currency string in USD.
 *
 * @param {number} amount - The amount to be formatted.
 */
export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

/**
 * Formats a number with comma separators.
 *
 * @param {number} number - The number to be formatted.
 */
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

const PERCENT_FORMATTER = new Intl.NumberFormat("en-US", { style: "percent" });

/**
 * Formats a discount code value based on its type.
 *
 * @param {Object} params - The discount code parameters.
 * @param {number} params.discountAmount - The discount amount.
 * @param {DiscountCodeType} params.discountType - The type of discount (percentage or fixed).
 */
export function formatDiscountCode({
  discountAmount,
  discountType,
}: {
  discountAmount: number;
  discountType: DiscountCodeType;
}) {
  switch (discountType) {
    case "PERCENTAGE":
      return PERCENT_FORMATTER.format(discountAmount / 100);
    case "FIXED":
      return formatCurrency(discountAmount);
    default:
      throw new Error(
        `Invalid discount code type ${discountType satisfies never}`
      );
  }
}

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

/**
 * Formats a date object as a human-readable date-time string.
 *
 * @param {Date} date - The date to be formatted.
 */
export function formatDateTime(date: Date) {
  return DATE_TIME_FORMATTER.format(date);
}
