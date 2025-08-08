import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import HomePage from "../pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import ViewCartPage from "@/pages/ViewCartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import MyOrdersPage from "@/pages/MyOrdersPage";
import ViewOrderDetailsPage from "@/pages/ViewOrderDetailsPage";
import BooksPage from "@/pages/BooksPage";
import StationaryPage from "@/pages/StationaryPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<ViewCartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order/success/:orderId" element={<OrderSuccessPage />} />
      <Route path="/myOrders" element={<MyOrdersPage />} />
      <Route path="/order/:orderId" element={<ViewOrderDetailsPage />} />
      <Route path="/books" element={<BooksPage />} />
      <Route path="/stationary" element={<StationaryPage />} />
    </Routes>
  );
};

export default AppRoutes;
