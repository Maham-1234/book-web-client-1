import type { FC } from "react";
import ProductListingPage from "./ProductListingPage";

const StationaryPage: FC = () => {
  return (
    <ProductListingPage
      pageTitle="Stationary"
      baseCategoryId={2}
      categoryFilterId={2}
    />
  );
};

export default StationaryPage;
