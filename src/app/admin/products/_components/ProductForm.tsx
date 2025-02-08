"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addProduct, updateProduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

/**
 * Form component for creating or updating a product.
 *
 * This form allows users to enter product details such as name, price, description,
 * file upload, and image upload. It supports both adding a new product and editing an existing product.
 *
 * @param {Object} props - The component props.
 * @param {Product | null} [props.product] - The existing product details (if editing), or `null` if creating a new product.
 */
export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );

  return (
    <form
      action={action}
      className="max-w-lg w-full mx-auto space-y-6 p-6 bg-transparent rounded-lg shadow-lg border border-gray-300"
    >
      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">
          Name
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
          className="w-full px-4 py-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 bg-[#232526] text-white"
        />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>

      {/* Price in Cents */}
      <div className="space-y-2">
        <Label htmlFor="priceInCents" className="text-white">
          Price In Cents
        </Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          className="w-full px-4 py-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 bg-[#232526] text-white"
          value={priceInCents ?? ""}
          onChange={(e) =>
            setPriceInCents(
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
        />
      </div>
      <div className="text-muted-foreground text-gray-300">
        {formatCurrency((priceInCents || 0) / 100)}
      </div>
      {error.priceInCents && (
        <div className="text-destructive">{error.priceInCents}</div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          required
          className="w-full px-4 py-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 bg-[#232526] text-white"
          defaultValue={product?.description}
        />
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="file" className="text-white">
          File
        </Label>
        <div className="border border-gray-500 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-700 transition-all">
          <Label
            htmlFor="file"
            className="cursor-pointer text-white w-full h-full flex items-center justify-center"
          >
            Upload File
          </Label>
          <Input
            type="file"
            id="file"
            name="file"
            className="hidden"
            required={product == null}
          />
        </div>
        {product != null && (
          <div className="text-gray-300">{product.filePath}</div>
        )}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image" className="text-white">
          Image
        </Label>
        <div className="border border-gray-500 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-700 transition-all">
          <Label
            htmlFor="file"
            className="cursor-pointer text-white w-full h-full flex items-center justify-center"
          >
            Upload Image
          </Label>
          <Input
            type="file"
            id="image"
            name="image"
            className="hidden"
            required={product == null}
          />
        </div>
        {product != null && (
          <Image
            src={`/${product.imagePath}`}
            height="400"
            width="400"
            alt="Product Image"
            className="rounded-lg shadow-md"
          />
        )}
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>

      {/* Save Button */}
      <SubmitButton />
    </form>
  );
}

/**
 * Submit button component that manages the form submission state.
 *
 * This button updates its label dynamically based on whether the form is in a pending state.
 *
 */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="bg-green-500 hover:bg-green-600 text-white w-full py-3 text-lg font-semibold rounded-md transition-all"
      type="submit"
      disabled={pending}
    >
      {pending ? "Saving..." : "Save Product"}
    </Button>
  );
}
