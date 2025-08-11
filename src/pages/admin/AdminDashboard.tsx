import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { useProduct } from "@/contexts/productContext";
import { useOrder } from "@/contexts/orderContext";
import { useAuth } from "@/contexts/authContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Plus,
  BookOpen,
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";

import { StatsCard } from "@/components/PageComponents/StatsCard";
import AdminProductDataTable from "@/components/PageComponents/admin/AdminProductDataTable";
import AdminOrderDataTable from "@/components/PageComponents/admin/AdminOrderDataTable";
import AdminUserDataTable from "@/components/PageComponents/admin/AdminUserDataTable";

export default function AdminDashboardPage() {
  const {
    paginatedData: productPagination,
    isLoading: productsLoading,
    fetchAllProducts,
  } = useProduct();

  const {
    paginatedOrders,
    isLoading: ordersLoading,
    fetchAllAdminOrders,
  } = useOrder();

  const { allUsers, isFetchingUsers, fetchAllUsers, updateUserAsAdmin } =
    useAuth();

  useEffect(() => {
    fetchAllProducts();
    fetchAllAdminOrders();
    fetchAllUsers();
  }, [fetchAllProducts, fetchAllAdminOrders, fetchAllUsers]);

  const totalRevenue = useMemo(() => {
    return (paginatedOrders?.orders || []).reduce((acc, order) => {
      return order.status === "delivered"
        ? acc + Number(order.totalAmount)
        : acc;
    }, 0);
  }, [paginatedOrders]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Oversee and manage your books and stationery store.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button asChild className="rounded-lg">
              <Link to="/admin/product/create" className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Link>
            </Button>
            <Button asChild className="rounded-lg">
              <Link to="/admin/category/create" className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add New Category
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards Grid - Now uses correct data from contexts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            Icon={DollarSign}
            value={`$${totalRevenue.toFixed(2)}`}
            label="Total Revenue"
          />
          <StatsCard
            Icon={ShoppingCart}
            value={String(paginatedOrders?.totalOrders ?? 0)}
            label="Total Orders"
          />
          <StatsCard
            Icon={BookOpen}
            // Assuming your product pagination also has a 'total' property
            value={String(productPagination?.total ?? 0)}
            label="Total Products"
          />
          <StatsCard
            Icon={Users}
            value={String(allUsers?.totalUsers ?? 0)}
            label="Total Users"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Manage Products Tab - Uses its own loading state */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Manage Products</CardTitle>
                <CardDescription>
                  View, edit, or update existing products in your catalog.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex justify-center items-center h-60">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <AdminProductDataTable
                    products={productPagination?.products || []}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Orders Tab - Uses its own loading state */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Manage Orders</CardTitle>
                <CardDescription>
                  View details and update the status of customer orders.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex justify-center items-center h-60">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <AdminOrderDataTable orders={paginatedOrders?.orders || []} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Users Tab - Uses the new user-specific loading state */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>
                  View user information and manage their roles and permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* AdminUserDataTable now receives the correct data and loading state */}
                <AdminUserDataTable
                  users={allUsers?.users || []}
                  isLoading={isFetchingUsers}
                  updateUserAsAdmin={updateUserAsAdmin}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
