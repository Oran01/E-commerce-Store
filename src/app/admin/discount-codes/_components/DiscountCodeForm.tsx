"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DiscountCodeType } from "@prisma/client";
import { addDiscountCode } from "@/app/admin/_actions/discountCodes";
import { Checkbox } from "@/components/ui/checkbox";
import { useActionState, useState } from "react";

/**
 * Renders a form for creating or updating a discount code.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {{ name: string; id: string }[]} props.products - List of available products to associate with the discount code.
 */
export function DiscountCodeForm({
  products,
}: {
  products: { name: string; id: string }[];
}) {
  const [error, action] = useActionState(addDiscountCode, {});
  const [allProducts, setAllProducts] = useState(true);
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  return (
    <div>
      <form
        action={action}
        className="max-w-lg w-full mx-auto space-y-6 p-6 bg-transparent rounded-lg shadow-lg border border-gray-300"
      >
        {/* Code Input */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-white">
            Code
          </Label>
          <Input
            type="text"
            id="code"
            name="code"
            required
            className="w-full bg-[#232526]  text-white border border-gray-500 rounded-md"
          />
          {error.code && <div className="text-destructive">{error.code}</div>}
        </div>

        {/* Discount Type & Amount */}
        <div className="space-y-2">
          <Label className="text-white">Discount Type</Label>
          <div className="flex items-center gap-6">
            <RadioGroup
              id="discountType"
              name="discountType"
              defaultValue={DiscountCodeType.PERCENTAGE}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  id="percentage"
                  value={DiscountCodeType.PERCENTAGE}
                  className="border border-white data-[state=checked]:bg-white"
                />
                <Label htmlFor="percentage" className="text-white">
                  Percentage
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  id="fixed"
                  value={DiscountCodeType.FIXED}
                  className="border border-white data-[state=checked]:bg-white"
                />
                <Label htmlFor="fixed" className="text-white">
                  Fixed
                </Label>
              </div>
            </RadioGroup>
            <Input
              type="number"
              id="discountAmount"
              name="discountAmount"
              required
              className="w-32 bg-[#232526]  text-white border border-gray-500 rounded-md"
              placeholder="Amount"
            />
          </div>
          {error.discountAmount && (
            <div className="text-destructive">{error.discountAmount}</div>
          )}
        </div>

        {/* Limit */}
        <div className="space-y-2">
          <Label htmlFor="limit" className="text-white">
            Limit
          </Label>
          <Input
            type="number"
            id="limit"
            name="limit"
            className="w-full bg-[#232526] text-white border border-gray-500 rounded-md"
            placeholder="Leave blank for infinite uses"
          />
          {error.limit && <div className="text-destructive">{error.limit}</div>}
        </div>

        {/* Expiration */}
        <div className="space-y-2">
          <Label htmlFor="expiresAt" className="text-white">
            Expiration
          </Label>
          <Input
            type="datetime-local"
            id="expiresAt"
            name="expiresAt"
            min={today.toISOString().split(":").slice(0, -1).join(":")}
            className="w-full bg-[#232526]  text-white border border-gray-500 rounded-md"
          />
          <div className="text-muted-foreground text-gray-400">
            Leave blank for no expiration
          </div>
          {error.expiresAt && (
            <div className="text-destructive">{error.expiresAt}</div>
          )}
        </div>

        {/* Allowed Products */}
        <div className="space-y-2 text-white">
          <Label>Allowed Products</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="allProducts"
              name="allProducts"
              checked={allProducts}
              onCheckedChange={(e) => setAllProducts(e === true)}
              className="border border-white"
            />
            <Label htmlFor="allProducts">All Products</Label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-2">
                <Checkbox
                  id={product.id}
                  name="productIds"
                  value={product.id}
                  disabled={allProducts}
                  className="border border-white"
                />
                <Label htmlFor={product.id}>{product.name}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <SubmitButton />
      </form>
    </div>
  );
}

/**
 * Renders a submit button for the discount code form.
 * The button displays a loading state when the form submission is pending.
 *
 */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold rounded-md transition-all"
      type="submit"
      disabled={pending}
    >
      {pending ? "Saving..." : "Save Coupon"}
    </Button>
  );
}
