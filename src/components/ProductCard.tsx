import { formatCurrency } from "@/lib/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
};

/**
 * ProductCard Component
 *
 * Renders a product card displaying product details, an image, and a purchase button.
 *
 * @param {ProductCardProps} props - The product details.
 */
export function ProductCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
}: ProductCardProps) {
  const shortDescription =
    description.length > 60
      ? description.substring(0, 60) + "..."
      : description;
  return (
    <Card
      className="flex overflow-hidden flex-col bg-transparent border-gray-300 
                  hover:scale-105 transition-transform duration-200 hover:shadow-xl"
    >
      <div
        className="relative w-full h-auto aspect-video"
        style={{ marginTop: "1rem" }}
      >
        <Image src={`/${imagePath.replace(/^\/+/, "")}`} fill alt={name} />
      </div>
      <CardHeader>
        <CardTitle className="text-white">{name}</CardTitle>
        <CardDescription className="text-gray-300">
          {formatCurrency(priceInCents / 100)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-white">{shortDescription}</p>
        {description.length > 60 && (
          <Link
            href={`/products/${id}`}
            className="text-blue-400 hover:underline"
          >
            Read More
          </Link>
        )}
      </CardContent>
      <CardFooter>
        <Button
          asChild
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all duration-200"
        >
          <Link href={`/products/${id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * ProductCardSkeleton Component
 *
 * Displays a skeleton placeholder while loading product data.
 *
 */
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col animate-pulse bg-white/20 border border-white/30 rounded-xl shadow-lg backdrop-blur-sm">
      <div className="w-full aspect-video bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
          <div className="w-1/2 h-4 rounded-full bg-gray-300" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-3/4 h-4 rounded-full bg-gray-300" />
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-[#232526]" disabled size="lg"></Button>
      </CardFooter>
    </Card>
  );
}
