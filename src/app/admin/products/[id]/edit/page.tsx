import db from "@/db/db";
import { PageHeader } from "../../../_components/PageHeader";
import { ProductForm } from "../../_components/ProductForm";

/**
 * EditProductPage Component
 *
 * This component renders the page for editing an existing product in the admin dashboard.
 * It fetches the product details based on the provided ID and passes them to the product form.
 *
 * @param {Object} params - The route parameters containing the product ID.
 * @param {string} params.id - The unique identifier of the product being edited.
 */
export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  return (
    <div className="flex flex-col items-center min-h-screen w-full mt-4 ml-48">
      <div className="w-full max-w-lg">
        <PageHeader>Edit Product</PageHeader>
        <ProductForm product={product} />
      </div>
    </div>
  );
}
