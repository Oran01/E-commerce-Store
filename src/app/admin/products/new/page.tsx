import { PageHeader } from "../../_components/PageHeader";
import { ProductForm } from "../_components/ProductForm";

/**
 * NewProductPage Component
 *
 * This component renders the page for adding a new product in the admin dashboard.
 * It includes a header and a product form for entering product details.
 *
 */
export default async function NewProductPage() {
  return (
    <div className="flex flex-col items-center min-h-screen w-full mt-4 ml-48">
      <div className="w-full max-w-lg">
        <PageHeader>New Product</PageHeader>
        <ProductForm />
      </div>
    </div>
  );
}
