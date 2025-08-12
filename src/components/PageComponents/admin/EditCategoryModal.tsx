import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import type { Category } from "@/types";

type EditCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  fieldToEdit: "name" | "parentId" | null;
  onSave: (
    categoryId: number,
    data: { name?: string; parentId?: number | null }
  ) => void;
};

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
  fieldToEdit,
  onSave,
}: EditCategoryModalProps) {
  const [value, setValue] = useState<string | number>("");

  useEffect(() => {
    if (category && fieldToEdit) {
      setValue(category[fieldToEdit] ?? "");
    }
  }, [category, fieldToEdit]);

  const handleSave = () => {
    if (category && fieldToEdit) {
      const data = { [fieldToEdit]: value };
      onSave(category.id, data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {fieldToEdit}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={fieldToEdit ?? ""} className="text-right">
              {fieldToEdit === "name" ? "Name" : "Parent ID"}
            </Label>
            <Input
              id={fieldToEdit ?? ""}
              value={value}
              onChange={(e) =>
                setValue(
                  fieldToEdit === "parentId"
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
