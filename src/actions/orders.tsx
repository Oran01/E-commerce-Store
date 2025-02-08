"use server";

import db from "@/db/db";
import OrderHistoryEmail from "@/email/OrderHistory";
import {
  getDiscountedAmount,
  usableDiscountCodeWhere,
} from "@/lib/discountCodeHelpers";
import { Resend } from "resend";
import Stripe from "stripe";
import { z } from "zod";

const emailSchema = z.string().email();
const resend = new Resend(process.env.RESEND_API_KEY as string);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * Handles sending an order history email to the user.
 *
 * @param {unknown} prevState - The previous state of the function, not used in this case.
 * @param {FormData} formData - The form data containing the user's email.
 */
export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get("email"));

  if (result.success === false) {
    return { error: "Invalid email address" };
  }

  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          pricePaidInCents: true,
          id: true,
          createAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (user == null) {
    return {
      message:
        "Check your email to view your order history and download your products.",
    };
  }

  const orders = user.orders.map(async (order) => {
    return {
      ...order,
      downloadVerificationId: (
        await db.downloadVerification.create({
          data: {
            expireAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
            productId: order.product.id,
          },
        })
      ).id,
    };
  });

  const data = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",
    react: <OrderHistoryEmail orders={await Promise.all(orders)} />,
  });

  if (data.error) {
    return {
      error: "There was an error sending your email. Please try again.",
    };
  }

  return {
    message:
      "Check your email to view your order history and download your products.",
  };
}

/**
 * Creates a Stripe payment intent for a given product and optional discount code.
 *
 * @param {string} email - The email of the user making the purchase.
 * @param {string} productId - The ID of the product being purchased.
 * @param {string} [discountCodeId] - An optional discount code ID to apply to the purchase.
 */
export async function createPaymentIntent(
  email: string,
  productId: string,
  discountCodeId?: string
) {
  const product = await db.product.findUnique({ where: { id: productId } });
  if (product == null) return { error: "Unexpected Error" };

  const discountCode =
    discountCodeId == null
      ? null
      : await db.discountCode.findUnique({
          where: { id: discountCodeId, ...usableDiscountCodeWhere(product.id) },
        });

  if (discountCode == null && discountCodeId != null) {
    return { error: "Coupon has expired" };
  }

  const existingOrder = await db.order.findFirst({
    where: { user: { email }, productId },
    select: { id: true },
  });

  if (existingOrder != null) {
    return {
      error:
        "You have already purchased this product. Try downloading it from the My Orders page",
    };
  }

  const amount =
    discountCode == null
      ? product.priceInCents
      : getDiscountedAmount(discountCode, product.priceInCents);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "USD",
    metadata: {
      productId: product.id,
      discountCodeId: discountCode?.id || null,
    },
  });

  if (paymentIntent.client_secret == null) {
    return { error: "Unknown error" };
  }

  return { clientSecret: paymentIntent.client_secret };
}
