// import { type FC, useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { useInventory } from "@/contexts/inventoryContext";
// import toast from "react-hot-toast";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2 } from "lucide-react";

// interface ManualTransactionFormProps {
//   productId: string;
// }

// type FormValues = {
//   type: "in" | "out";
//   quantity: number;
//   reason: "restock" | "damage" | "return";
// };

// export const ManualTransactionForm: FC<ManualTransactionFormProps> = ({
//   productId,
// }) => {
//   const { addManualTransaction } = useInventory();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm<FormValues>();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const transactionType = watch("type");

//   const onSubmit: SubmitHandler<FormValues> = async (data) => {
//     setIsSubmitting(true);
//     const transactionPromise = addManualTransaction({
//       ...data,
//       quantity: Number(data.quantity), // Ensure quantity is a number
//       productId,
//     });

//     toast.promise(transactionPromise, {
//       loading: "Recording transaction...",
//       success: () => {
//         setIsSubmitting(false);
//         reset();
//         return "Transaction recorded successfully! Product stock updated.";
//       },
//       error: (err) => {
//         setIsSubmitting(false);
//         return err.message || "Failed to record transaction.";
//       },
//     });
//   };

//   return (
//     <Card>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <CardHeader>
//           <CardTitle>Manage Inventory</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <Label>Transaction Type</Label>
//               <Select
//                 onValueChange={(value) =>
//                   reset({ ...watch(), type: value as FormValues["type"] })
//                 }
//                 name="type"
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a type..." />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="in">Stock In</SelectItem>
//                   <SelectItem value="out">Stock Out</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="quantity">Quantity</Label>
//               <Input
//                 id="quantity"
//                 type="number"
//                 {...register("quantity", {
//                   required: "Quantity is required",
//                   min: 1,
//                 })}
//               />
//               {errors.quantity && (
//                 <p className="text-sm text-destructive mt-1">
//                   {errors.quantity.message}
//                 </p>
//               )}
//             </div>
//           </div>
//           <div>
//             <Label>Reason</Label>
//             <Select
//               onValueChange={(value) =>
//                 reset({ ...watch(), reason: value as FormValues["reason"] })
//               }
//               name="reason"
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a reason..." />
//               </SelectTrigger>
//               <SelectContent>
//                 {transactionType === "in" ? (
//                   <>
//                     <SelectItem value="restock">Restock</SelectItem>
//                     <SelectItem value="return">Customer Return</SelectItem>
//                   </>
//                 ) : (
//                   <SelectItem value="damage">Damaged Goods</SelectItem>
//                 )}
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             Submit Transaction
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// };
import { type FC, useState } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useInventory } from "@/contexts/inventoryContext";
import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ManualTransactionFormProps {
  productId: string;
}

type FormValues = {
  type: "in" | "out";
  quantity: number;
  reason: string;
};

export const ManualTransactionForm: FC<ManualTransactionFormProps> = ({
  productId,
}) => {
  const { addManualTransaction } = useInventory();
  const {
    register,
    handleSubmit,
    control, // Get control from useForm
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      type: undefined,
      quantity: 1,
      reason: undefined,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Watch the transaction type to dynamically change the reason options
  const transactionType = watch("type");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await addManualTransaction({
        ...data,
        quantity: Number(data.quantity),
        productId,
      });
      toast.success("Transaction recorded successfully!");
      reset(); // Reset form to default values
    } catch (err: any) {
      toast.error(err.message || "Failed to record transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Manage Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="type">Transaction Type</Label>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Type is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select a type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Stock In</SelectItem>
                      <SelectItem value="out">Stock Out</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-destructive">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Field 2: Quantity */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                {...register("quantity", {
                  required: "Quantity is required",
                  min: { value: 1, message: "Quantity must be at least 1" },
                  valueAsNumber: true,
                })}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          {/* Field 3: Reason */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="reason">Reason</Label>
            <Controller
              name="reason"
              control={control}
              rules={{ required: "Reason is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  // Disable if transaction type is not selected
                  disabled={!transactionType}
                >
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionType === "in" ? (
                      <>
                        <SelectItem value="restock">Restock</SelectItem>
                        <SelectItem value="return">Customer Return</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="damage">Damaged Goods</SelectItem>
                        <SelectItem value="theft">Theft/Loss</SelectItem>
                        <SelectItem value="promotion">
                          Promotional Giveaway
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">
                {errors.reason.message}
              </p>
            )}
          </div>
        </CardContent>
        {/* NEW: Aligned button to the right */}
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Transaction
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
