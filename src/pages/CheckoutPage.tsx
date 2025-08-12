import { type FC, useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";

import { useAuth } from "@/contexts/authContext";
import { useCart } from "@/contexts/cartContext";
import { useOrder } from "@/contexts/orderContext";
import { createPaymentIntent } from "@/api/modules/order";
import CheckoutForm from "@/components/PageComponents/order/CheckoutForm";
import { Loader2 } from "lucide-react";
import type { ShippingAddress } from "@/types";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CheckoutPageContentProps {
  clientSecret: string;
}

const CheckoutPageContent: FC<CheckoutPageContentProps> = ({
  clientSecret,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartTotal, emptyCart } = useCart();
  const { placeOrder } = useOrder();
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleFormSubmit = async (shippingAddress: ShippingAddress) => {
    if (!stripe || !elements) {
      setPaymentError("Payment services are not yet available.");
      return;
    }

    const cardElement = elements.getElement("card");
    if (!cardElement) {
      setPaymentError("Card details could not be found.");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    const paymentFlowPromise = new Promise(async (resolve, reject) => {
      try {
        const { error: stripeError, paymentIntent } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: `${user?.firstName} ${user?.lastName}`,
                email: user?.email,
              },
            },
          });

        if (stripeError) return reject(new Error(stripeError.message));
        if (paymentIntent?.status !== "succeeded") {
          return reject(new Error("Payment was not successful."));
        }

        const newOrder = await placeOrder({
          shippingAddress,
          paymentIntentId: paymentIntent.id,
        });
        console.log("newOrder: ", newOrder);

        emptyCart();
        resolve(newOrder);
      } catch (err: any) {
        reject(err);
      }
    });

    toast.promise(paymentFlowPromise, {
      loading: "Processing payment and creating order...",
      success: (newOrder: any) => {
        navigate(`/order/success/${newOrder.id}`);
        return "Order placed successfully!";
      },
      error: (err) => {
        setIsProcessingPayment(false);
        return err.message || "Checkout failed. Please try again.";
      },
    });
  };

  return (
    <CheckoutForm
      user={user}
      cartTotal={cartTotal || 0}
      isProcessingPayment={isProcessingPayment}
      paymentError={paymentError}
      stripeIsReady={!!stripe}
      onFormSubmit={handleFormSubmit}
    />
  );
};

const CheckoutPage: FC = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { itemCount, isLoading: isCartLoading } = useCart();

  useEffect(() => {
    if (itemCount != null && itemCount > 0) {
      createPaymentIntent()
        .then((data) => setClientSecret(data))
        .catch(() =>
          setError(
            "Could not initialize payment. Please refresh and try again."
          )
        );
    }
  }, [itemCount]);

  if (!isCartLoading && itemCount === 0) {
    return <Navigate to="/cart" replace />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-destructive text-xl">{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-4 h-8 w-8 animate-spin" />
        <span className="text-xl">Initializing secure checkout...</span>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: "stripe" },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <Elements options={options} stripe={stripePromise}>
        <CheckoutPageContent clientSecret={clientSecret} />
      </Elements>
    </div>
  );
};
export default CheckoutPage;
