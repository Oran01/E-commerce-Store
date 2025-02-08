import db from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { CheckoutForm } from "./_components/CheckoutForm";
import { usableDiscountCodeWhere } from "@/lib/discountCodeHelpers";

/**
 * Initializes Stripe with the secret key.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * Purchase Page component.
 * Fetches the product details and applicable discount code before rendering the checkout form.
 *
 * @param {Object} params - The parameters from the route.
 * @param {string} params.id - The product ID.
 * @param {Object} searchParams - The search parameters.
 * @param {string} [searchParams.coupon] - The optional discount code.
 * @returns {Promise<JSX.Element>} - The JSX structure for the purchase page.
 */
export default async function PurchasePage({
  params: { id },
  searchParams: { coupon },
}: {
  params: { id: string };
  searchParams: { coupon?: string };
}) {
  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  const discountCode =
    coupon == null ? undefined : await getDiscountCode(coupon, product.id);

  return (
    <div className="space-y-4" style={{ marginLeft: "2rem" }}>
      <CheckoutForm
        product={product}
        discountCode={discountCode || undefined}
      />
    </div>
  );
}

/**
 * Fetches a valid discount code if available for the given product.
 *
 * @param {string} coupon - The discount code entered by the user.
 * @param {string} productId - The product ID to apply the discount.
 * @returns {Promise<{ id: string; discountAmount: number; discountType: string } | null>}
 * - The discount code details if valid, otherwise null.
 */
function getDiscountCode(coupon: string, productId: string) {
  return db.discountCode.findUnique({
    select: { id: true, discountAmount: true, discountType: true },
    where: { ...usableDiscountCodeWhere, code: coupon },
  });
}
