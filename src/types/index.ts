import type { deleteProduct } from "@/api/modules/product";

export interface User {
  id: string; // UUID
  firstName: string;
  lastName: string;
  email: string;
  role: "buyer" | "admin";
  provider: "local" | "google";
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface Category {
  id: number; // Integer ID
  name: string;
  slug: string;
  parentId: number | null;
  isActive: boolean;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string; // UUID
  name: string;
  slug: string;
  description: string;
  price: number; // Or string if  backend serializes decimals as strings
  sku: string;
  stock: number;
  images: string[];
  productType: "Books" | "Stationary";
  author: string | null;
  isbn: string | null;
  brand: string | null;
  isActive: boolean;
  categoryId: number; // Corresponds to Category's integer ID
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  // Product details are nested for easy display in the cart
  product: Pick<Product, "id" | "name" | "slug" | "price" | "images" | "stock">;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: Pick<Product, "id" | "name" | "sku" | "images">;
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export type Reviewer = Pick<User, "id" | "firstName" | "avatar">;

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  isVerifiedPurchase: boolean;
  productId: string;
  user: Reviewer;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: "success";
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data?: T[];
  orders?: T[];
  users?: T[];

  total: number;
  totalOrders?: number;
  totalUsers?: number;

  totalPages: number;
  currentPage: number;
}

export interface ApiErrorResponse {
  status: "fail" | "error";
  message?: string;
  errors?: {
    path: (string | number)[];
    message: string;
  }[];
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export type UpdateProfileData = Partial<Pick<User, "firstName" | "lastName">>;

type BookData = Pick<
  Product,
  | "name"
  | "description"
  | "price"
  | "sku"
  | "stock"
  | "categoryId"
  | "author"
  | "isbn"
> & { productType: "Books" };
type StationeryData = Pick<
  Product,
  "name" | "description" | "price" | "sku" | "stock" | "categoryId" | "brand"
> & { productType: "Stationary" };
export type CreateProductData = (BookData | StationeryData) & {
  images?: File[];
};
export type UpdateProductData = Partial<CreateProductData>;

export interface CreateCategoryData {
  name: string;
  parentId?: number | null;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;

export interface AddItemToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface CreateOrderData {
  shippingAddress: ShippingAddress;
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  comment?: string;
}

export type UpdateReviewData = Partial<Omit<CreateReviewData, "productId">>;

export type Theme = "light" | "dark";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  allUsers: PaginatedResponse<User> | null;
  isFetchingUsers: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  fetchAllUsers: (page?: number, imit?: number) => Promise<void>;
  updateUserAsAdmin: (
    userId: string,
    data: { isActive?: boolean }
  ) => Promise<void>;
  clearError: () => void;
}

export interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number | null;
  cartTotal: number | null;
  isUpdatingItem: string | null;
  loadCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  emptyCart: () => Promise<void>;
  clearError: () => void;
}
export interface ProductContextType {
  products: Product[];
  paginatedData: PaginatedResponse<Product> | null;
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  fetchAllProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  clearProduct: () => void;
  updateProduct: (
    productId: string,
    data: UpdateProductData
  ) => Promise<Product>;
  createProduct: (data: CreateProductData) => Promise<Product>;
  deleteProduct: (productId: string) => Promise<void>;
  clearError: () => void;
}

export interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  paginatedOrders: PaginatedResponse<Order> | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  placeOrder: (data: CreateOrderData) => Promise<Order>;
  fetchMyOrders: () => Promise<void>;
  fetchOrderDetails: (orderId: string) => Promise<void>;
  fetchAllAdminOrders: (page?: number, limit?: number) => Promise<void>;
  updateStatusAdmin: (
    orderId: string,
    status: Order["status"]
  ) => Promise<void>;
  clearCurrentOrder: () => void;
  cancelUserOrder: (orderId: string) => Promise<void>;
  clearError: () => void;
}

export interface CategoryContextType {
  categoryTree: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategoryTree: () => Promise<void>;
  createCategory: (data: CreateCategoryData) => Promise<void>;
  updateCategory: (
    categoryId: number,
    data: UpdateCategoryData
  ) => Promise<void>;
  deleteCategory: (categoryId: number) => Promise<void>;
}

export interface ReviewContextType {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  getReviews: (productId: string) => Promise<void>;
  addReview: (data: CreateReviewData) => Promise<void>;
  editReview: (reviewId: string, data: UpdateReviewData) => Promise<void>;
  removeReview: (reviewId: string) => Promise<void>;

  clearError: () => void;
}
export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  sortBy?: "price" | "createdAt" | "name";
  sortOrder?: "ASC" | "DESC";
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  images: string[];
  productType: "Books" | "Stationary";
  author?: string;
  isbn?: string;
  brand?: string;
  categoryId: number;
}

export type UpdateUserData = { isActive?: boolean };
