import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Suspense } from "react";

/**
 * Fetches all available products from the database.
 * Products are ordered alphabetically by name.
 *
 * @returns {Promise<Product[]>} - A promise that resolves to an array of available products.
 */
const getProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: "asc" },
  });
}, ["/products", "getProducts"]);

/**
 * Product Page component.
 * Displays a grid of products fetched from the database.
 *
 * @returns {JSX.Element} - The product listing page structure.
 */
export default function ProductPage() {
  return (
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductsSuspense />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * Suspense-wrapped component that fetches and renders the list of products.
 * Ensures products are displayed only after data is fully loaded.
 *
 * @returns {Promise<JSX.Element[]>} - A promise resolving to an array of ProductCard components.
 */
async function ProductsSuspense() {
  const products = await getProducts();
  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
