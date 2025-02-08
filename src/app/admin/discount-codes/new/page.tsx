import { DiscountCodeForm } from "@/app/admin/discount-codes/_components/DiscountCodeForm";
import { PageHeader } from "../../_components/PageHeader";
import db from "@/db/db";

/**
 * Renders the "New Discount Code" page.
 *
 * Fetches available products from the database to associate with the discount code.
 * Provides a form (`DiscountCodeForm`) for creating a new discount code.
 *
 */
export default async function NewDiscountCodePage() {
  const products = await db.product.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col items-center min-h-screen w-full mt-4 ml-48">
      <div className="w-full max-w-lg">
        <PageHeader>New Coupon</PageHeader>
        <DiscountCodeForm products={products} />
      </div>
    </div>
  );
}
