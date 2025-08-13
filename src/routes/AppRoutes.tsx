import { Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "@/components/PageComponents/ProtectedRoute";
import { RoleGuard } from "@/components/PageComponents/RoleGuard";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import HomePage from "../pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import BooksPage from "@/pages/BooksPage";
import StationaryPage from "@/pages/StationaryPage";

import ViewCartPage from "@/pages/ViewCartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import MyOrdersPage from "@/pages/MyOrdersPage";
import ViewOrderDetailsPage from "@/pages/ViewOrderDetailsPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminDashboardPage from "@/pages/admin/AdminDashboard";
import AddProductPage from "@/pages/admin/AddProductPage";
import ManageProductPage from "@/pages/admin/ManageProductPage";
import AddCategoryPage from "@/pages/admin/AddCategoryPage";
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";
import NotFoundPage from "@/pages/NotFoundPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/books" element={<BooksPage />} />
      <Route path="/stationary" element={<StationaryPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route element={<RoleGuard allowedRoles={["buyer"]} />}>
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <ViewCartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/success/:orderId"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myOrders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute>
              <ViewOrderDetailsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<RoleGuard allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/product/create" element={<AddProductPage />} />
        <Route path="/admin/product/edit/:id" element={<ManageProductPage />} />
        <Route path="/admin/category/create" element={<AddCategoryPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
