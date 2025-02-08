import { Button } from "@/components/ui/button";
import db from "@/db/db";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * SuccessPage component that displays a confirmation message after a successful purchase.
 * It retrieves the purchased product details and provides a download link.
 *
 * @param {Object} searchParams - The search parameters containing the payment intent ID.
 */
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  // Retrieve payment intent details from Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );
  if (paymentIntent.metadata.productId == null) return notFound();

  // Fetch product details from the database
  const product = await db.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  });
  if (product == null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className="flex flex-col items-center text-center space-y-6 mt-10 ml-96">
      <h1 className="text-5xl font-extrabold text-green-500 animate-bounce">
        Success!
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-48 h-48">
          <Image
            src={`/${product.imagePath.replace(/^\/+/, "")}`}
            fill
            className="rounded-lg shadow-lg"
            alt={product.name}
          />
        </div>
        <h2 className="text-2xl font-semibold text-white">{product.name}</h2>
        <p className="text-gray-400 max-w-lg">{product.description}</p>
      </div>
      <Button
        className="mt-4 px-6 py-3 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-transform transform hover:scale-105"
        size="lg"
        asChild
      >
        {isSuccess ? (
          <a
            href={`/products/download/${await createDownloadVerification(product.id)}`}
          >
            Download Now
          </a>
        ) : (
          <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
        )}
      </Button>
    </div>
  );
}

/**
 * Creates a verification entry for downloading the purchased product.
 *
 * @param {string} productId - The ID of the purchased product.
 */
async function createDownloadVerification(productId: string) {
  return (
    await db.downloadVerification.create({
      data: {
        productId,
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  ).id;
}
