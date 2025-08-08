import type { FC } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import { useCart } from "@/contexts/cartContext";
import { useOrder } from "@/contexts/orderContext";
import { useAuth } from "@/contexts/authContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import type { ShippingAddress } from "@/types";

type CheckoutFormValues = ShippingAddress;

const CheckoutPage: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, itemCount, cartTotal, isLoading: isCartLoading } = useCart();
  const { placeOrder, isLoading: isPlacingOrder } = useOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>();

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (
    shippingAddress
  ) => {
    // Create a toast promise for the checkout process
    const checkoutPromise = placeOrder({ shippingAddress });

    toast.promise(checkoutPromise, {
      loading: "Placing your order...",
      success: (newOrder) => {
        navigate(`/order/success/${newOrder.id}`); // Redirect on success
        return "Order placed successfully!";
      },
      error: (err) => err.message || "Checkout failed. Please try again.",
    });
  };

  // If the cart is loading or the cart is empty, redirect back to the home or cart page
  if (!isCartLoading && (!cart || itemCount === 0)) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping Information Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                id="checkout-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* We can pre-fill the name from the user's profile */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input disabled defaultValue={user?.firstName} />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input disabled defaultValue={user?.lastName} />
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
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${cartTotal?.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Shipping and taxes calculated at next step.
              </p>
            </CardContent>
            {/* The button is outside the form, but triggers it via the form ID */}
            <Button
              form="checkout-form"
              type="submit"
              className="w-full rounded-t-none"
              size="lg"
              disabled={isPlacingOrder}
            >
              {isPlacingOrder && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Place Order
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
