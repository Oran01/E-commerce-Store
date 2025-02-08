import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

/**
 * Fetches the most popular products based on order count.
 * Cached for **24 hours** to reduce database queries.
 *
 * @returns {Promise<Product[]>} - A list of the top 6 most popular products.
 */
const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } }, // Sorting by order count
      take: 6, // Limiting to 6 products
    });
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 } // Cache expiration: 24 hours
);

/**
 * Fetches the newest available products sorted by creation date.
 *
 * @returns {Promise<Product[]>} - A list of the top 6 newest products.
 */
const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createAt: "desc" }, // Sorting by creation date (newest first)
    take: 6, // Limiting to 6 products
  });
}, ["/", "getNewestProducts"]);

/**
 * The **HomePage** component displaying the most popular and newest products.
 * Uses `ProductGridSection` to structure product listings.
 *
 * @returns {JSX.Element} - The homepage layout.
 */
export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        title="Most Popular"
        productsFetcher={getMostPopularProducts}
      />
      <ProductGridSection title="Newest" productsFetcher={getNewestProducts} />
    </main>
  );
}

// Define type for the ProductGridSection component
type ProductGridSectionProps = {
  title: string;
  productsFetcher: () => Promise<Product[]>;
};

/**
 * Displays a section of products with a title and a "View All" button.
 *
 * @param {string} title - The title of the product section.
 * @param {() => Promise<Product[]>} productsFetcher - Function to fetch product data.
 * @returns {JSX.Element} - A grid of product cards.
 */
function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-12 mx-auto max-w-screen-xl px-6 ml-0">
      <div className="flex items-center gap-4">
        <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">
          {title}
        </h2>
        <Button
          variant="outline"
          asChild
          className="relative px-5 py-2 bg-gradient-to-r from-[#232526] to-[#414345] text-white border border-gray-600 rounded-lg transition-all duration-300 hover:from-[#2c2e2f] hover:to-[#515456] hover:scale-105 shadow-md flex items-center gap-2"
        >
          <Link href="/products">
            <span className="text-lg font-medium">View All</span>
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1 text-blue-400" />
          </Link>
        </Button>
      </div>
      <div className="container mx-auto px-12" style={{ marginLeft: "-3rem" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Suspense
            fallback={
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            }
          >
            <ProductSuspense productsFetcher={productsFetcher} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

/**
 * Fetches and displays products using Suspense.
 *
 * @param {() => Promise<Product[]>} productsFetcher - Function that retrieves product data.
 * @returns {JSX.Element[]} - An array of product cards.
 */
async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>;
}) {
  return (await productsFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
