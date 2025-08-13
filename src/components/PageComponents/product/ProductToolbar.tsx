import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductToolbarProps = {
  onSearch: (query: string) => void;
  onSortChange: (sortValue: string) => void;
};

export const ProductToolbar: React.FC<ProductToolbarProps> = ({
  onSearch,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
      <div className="w-full md:w-1/2 lg:w-1/3">
        <Input
          type="search"
          placeholder="Search for products..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearch(e.target.value)
          }
          className="rounded-full"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Select
          onValueChange={(value: string) => onSortChange(value)}
          defaultValue="createdAt-DESC"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-DESC">Newest</SelectItem>
            <SelectItem value="price-ASC">Price: Low to High</SelectItem>
            <SelectItem value="price-DESC">Price: High to Low</SelectItem>
            <SelectItem value="name-ASC">Name: A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
