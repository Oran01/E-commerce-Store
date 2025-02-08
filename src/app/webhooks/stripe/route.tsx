import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import PurchaseReceiptEmail from "@/email/PurchaseReceipt";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

/**
 * Handles incoming POST requests from Stripe webhooks.
 * This function listens for successful charges and processes the order accordingly.
 *
 * @param {NextRequest} req - The incoming request object.
 */
export async function POST(req: NextRequest) {
  // Construct the Stripe event from the webhook request
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  // Process successful payment events
  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const discountCodeId = charge.metadata.discountCodeId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    // Fetch product details
    const product = await db.product.findUnique({ where: { id: productId } });
    if (product == null || email == null) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Create or update user order record
    const userFields = {
      email,
      orders: { create: { productId, pricePaidInCents, discountCodeId } },
    };
    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createAt: "desc" }, take: 1 } },
    });

    // Generate a download verification link for the purchased product
    const downloadVerification = await db.downloadVerification.create({
      data: {
        productId,
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    // Update discount code usage if applicable
    if (discountCodeId != null) {
      await db.discountCode.update({
        where: { id: discountCodeId },
        data: { uses: { increment: 1 } },
      });
    }

    // Send order confirmation email with download link
    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Order Confirmation",
      react: (
        <PurchaseReceiptEmail
          order={order}
          product={product}
          downloadVerificationId={downloadVerification.id}
        />
      ),
    });
  }

  return new NextResponse();
}
