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

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
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

      <Route element={<RoleGuard allowedRoles={["admin"]} />}>
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        {/* <Route path="/admin/products" element={<ProductManagementPage />} /> */}
      </Route>

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
