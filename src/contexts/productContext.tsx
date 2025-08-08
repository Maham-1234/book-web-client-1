import {
  createContext,
  useState,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

import type {
  Product,
  ProductContextType,
  ProductFilters,
  PaginatedResponse,
  ApiErrorResponse,
  CreateProductData,
} from "../types";

import {
  fetchProducts as apiFetchProducts,
  fetchProductById as apiFetchProductById,
  createProductText as apiCreateProductText,
  uploadProductImages as apiUploadProductImages,
} from "../api/modules/product";

export const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

type ProductProviderProps = {
  children: ReactNode;
};

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [paginatedData, setPaginatedData] =
    useState<PaginatedResponse<Product> | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Fetches a paginated list of products based on filter criteria.
   * @param filters - Options for searching, sorting, pagination, etc.
   */
  const fetchAllProducts = useCallback(async (filters?: ProductFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiFetchProducts(filters);
      console.log("Fetched products:", response);
      if (
        response &&
        response.products &&
        Array.isArray(response.products.products)
      ) {
        setProducts(response.products.products);
        setPaginatedData(response.products);
      } else {
        console.error("API response format is incorrect:", response);
        setProducts([]);
        setPaginatedData(null);
      }
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetches a single product by its URL slug.
   * @param id - The product's unique slug.
   */
  const fetchProductById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { product } = await apiFetchProductById(id);
      console.log("Fetched product:", product);
      if (!product) {
        throw new Error("Product not found");
      }
      setProduct(product);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Could not find the requested product.");
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearProduct = useCallback(() => {
    setProduct(null);
  }, []);

  const createProduct = useCallback(
    async (data: CreateProductData): Promise<Product> => {
      setIsLoading(true);
      setError(null);

      try {
        const { images, ...textData } = data;

        const textResponse = await apiCreateProductText(textData);
        const newProduct = textResponse.product;

        if (images && images.length > 0) {
          const imageResponse = await apiUploadProductImages(
            newProduct.id,
            images
          );
          return imageResponse.product;
        }

        return newProduct;
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        const errorMessage = apiError.message || "Failed to create product.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const value: ProductContextType = {
    products,
    paginatedData,
    product,
    isLoading,
    error,
    fetchAllProducts,
    fetchProductById,
    createProduct,
    clearProduct,
    clearError,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProduct(): ProductContextType {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}
