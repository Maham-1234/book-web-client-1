import { type FC } from "react";
import { useForm } from "react-hook-form";
import { CardElement } from "@stripe/react-stripe-js";
import type { StripeCardElementOptions } from "@stripe/stripe-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import type { ShippingAddress, User } from "@/types";

interface CheckoutFormProps {
  user: User | null;
  cartTotal: number;
  isProcessingPayment: boolean;
  paymentError: string | null;
  onFormSubmit: (data: ShippingAddress) => void;
  stripeIsReady: boolean;
}

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm: FC<CheckoutFormProps> = ({
  user,
  cartTotal,
  isProcessingPayment,
  paymentError,
  onFormSubmit,
  stripeIsReady,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddress>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <form
        id="checkout-form"
        onSubmit={handleSubmit(onFormSubmit)}
        className="lg:col-span-2 space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input readOnly disabled defaultValue={user?.firstName} />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input readOnly disabled defaultValue={user?.lastName} />
              </div>
            </div>
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                {...register("street", {
                  required: "Street address is required",
                })}
              />
              {errors.street && (
                <p className="text-sm text-destructive mt-1">
                  {errors.street.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register("city", { required: "City is required" })}
                />
                {errors.city && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  {...register("state", { required: "State is required" })}
                />
                {errors.state && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                <Input
                  id="zipCode"
                  {...register("zipCode", {
                    required: "ZIP Code is required",
                  })}
                />
                {errors.zipCode && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register("country", {
                  required: "Country is required",
                })}
              />
              {errors.country && (
                <p className="text-sm text-destructive mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentError ? (
              <p className="text-destructive text-center">{paymentError}</p>
            ) : (
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            )}
          </CardContent>
        </Card>
      </form>

      {/* Order Summary Section */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              All prices include taxes and shipping.
            </p>
          </CardContent>
          <Button
            form="checkout-form"
            type="submit"
            className="w-full rounded-t-none"
            size="lg"
            // Disable button if processing or if Stripe isn't ready
            disabled={isProcessingPayment || !stripeIsReady}
          >
            {isProcessingPayment && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isProcessingPayment
              ? "Processing..."
              : `Pay $${cartTotal.toFixed(2)}`}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
