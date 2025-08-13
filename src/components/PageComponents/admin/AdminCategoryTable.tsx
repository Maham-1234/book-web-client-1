import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCategory } from "@/contexts/categoryContext";
import type { Category, CategoryContextType } from "@/types";
import EditCategoryModal from "./EditCategoryModal"; // Assuming this modal exists

type AdminCategoryDataTableProps = {
  categories: Category[]; // This is the category tree
};

// A new recursive component to render each category row and its children
const CategoryRow = ({
  category,
  level = 0,
  onEdit,
  onDelete,
}: {
  category: Category;
  level?: number;
  onEdit: (category: Category, field: "name" | "parentId") => void;
  onDelete: (categoryId: number) => void;
}) => {
  const indentStyle = { paddingLeft: `${level * 24}px` };

  return (
    <>
      <TableRow key={category.id}>
        <TableCell>{category.id}</TableCell>
        <TableCell style={indentStyle}>
          {level > 0 && <span className="mr-2 text-muted-foreground">↳</span>}
          {category.name}
        </TableCell>
        <TableCell>{category.parentId ?? "N/A"}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground dark:focus:ring"
              >
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onEdit(category, "name")}>
                Edit Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(category, "parentId")}>
                Edit Parent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(category.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {/* If the category has children, render them recursively */}
      {category.children?.map((child) => (
        <CategoryRow
          key={child.id}
          category={child}
          level={level + 1}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

export default function AdminCategoryDataTable({
  categories,
}: AdminCategoryDataTableProps) {
  const { updateCategory, deleteCategory }: CategoryContextType = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [fieldToEdit, setFieldToEdit] = useState<"name" | "parentId" | null>(
    null
  );

  const handleOpenModal = (category: Category, field: "name" | "parentId") => {
    setSelectedCategory(category);
    setFieldToEdit(field);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFieldToEdit(null);
  };

  const handleSaveCategory = (
    categoryId: number,
    data: { name?: string; parentId?: number | null }
  ) => {
    updateCategory(categoryId, data);
    handleCloseModal();
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory(categoryId);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Parent ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onEdit={handleOpenModal}
              onDelete={handleDeleteCategory}
            />
          ))}
        </TableBody>
      </Table>
      <EditCategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
        fieldToEdit={fieldToEdit}
        onSave={handleSaveCategory}
      />
    </>
  );
}
