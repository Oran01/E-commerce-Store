"use client";

import { emailOrderHistory } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

/**
 * My Orders Page component.
 * This page allows users to enter their email and receive their order history
 * along with download links.
 *
 */
export default function MyOrdersPage() {
  /**
   * Handles the order history request action.
   * Uses `useActionState` to manage form state and errors when submitting the email.
   */
  const [data, action] = useActionState(emailOrderHistory, {});

  return (
    <div className="flex items-start justify-center ml-96 mt-6">
      <form action={action} className="w-full max-w-lg">
        <Card className="bg-[#1a1a1a] border border-gray-600 shadow-lg rounded-lg p-6">
          <CardHeader>
            <CardTitle className="text-white text-2xl font-bold">
              My Orders
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email and we will send you your order history and
              download links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="email" className="text-white text-lg">
                Email Address
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 bg-black text-white"
              />
              {data.error && (
                <div className="text-red-500 text-sm">{data.error}</div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            {data.message ? (
              <p className="text-green-400">{data.message}</p>
            ) : (
              <SubmitButton />
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

/**
 * Submit button component for the My Orders form.
 * Disables the button when the form submission is pending.
 *
 */
function SubmitButton() {
  /**
   * Retrieves the current form submission status.
   * Used to disable the submit button while processing.
   */
  const { pending } = useFormStatus();

  return (
    <Button
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-lg transition-all"
      size="lg"
      disabled={pending}
      type="submit"
    >
      {pending ? "Sending..." : "Send"}
    </Button>
  );
}
