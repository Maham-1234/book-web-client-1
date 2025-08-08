import type { FC } from "react";
import ProductListingPage from "./ProductListingPage";

const BooksPage: FC = () => {
  return (
    <ProductListingPage
      pageTitle="Books"
      baseCategoryId={1}
      categoryFilterId={1}
    />
  );
};

export default BooksPage;
