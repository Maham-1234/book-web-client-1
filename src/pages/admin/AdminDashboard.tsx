import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useProduct } from "@/contexts/productContext";
import { useOrder } from "@/contexts/orderContext";
import { useAuth } from "@/contexts/authContext";
import { useCategory } from "@/contexts/categoryContext";

import { flattenCategories } from "@/lib/flattenCategories";
import {
  fetchSalesOverTime,
  fetchTopSellingProducts,
} from "@/api/modules/dashboard";
import type { SalesData, TopProductData } from "@/types";

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
  ClipboardList,
  BarChart2,
} from "lucide-react";

import { StatsCard } from "@/components/PageComponents/StatsCard";
import AdminProductDataTable from "@/components/PageComponents/admin/AdminProductDataTable";
import AdminOrderDataTable from "@/components/PageComponents/admin/AdminOrderDataTable";
import AdminUserDataTable from "@/components/PageComponents/admin/AdminUserDataTable";
import AdminCategoryDataTable from "@/components/PageComponents/admin/AdminCategoryTable";
import { SalesOverTimeChart } from "@/components/PageComponents/admin/SalesOverTimeChart";
import { TopProductsChart } from "@/components/PageComponents/admin/TopProductsChart";

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
  const {
    categoryTree,
    isLoading: categoriesLoading,
    fetchCategoryTree,
  } = useCategory();

  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductData[]>([]);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
    fetchAllAdminOrders();
    fetchAllUsers();
    fetchCategoryTree();

    const fetchAnalytics = async () => {
      setIsAnalyticsLoading(true);
      try {
        const [sales, top] = await Promise.all([
          fetchSalesOverTime(),
          fetchTopSellingProducts(),
        ]);
        setSalesData(sales.sales);
        setTopProducts(top.topProducts);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setIsAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, [fetchAllProducts, fetchAllAdminOrders, fetchAllUsers, fetchCategoryTree]);

  const totalRevenue = useMemo(
    () =>
      (paginatedOrders?.orders || []).reduce(
        (acc, order) =>
          order.status === "delivered" ? acc + Number(order.totalAmount) : acc,
        0
      ),
    [paginatedOrders]
  );
  const totalCategoriesCount = useMemo(
    () => flattenCategories(categoryTree || []).length,
    [categoryTree]
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
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
            value={String(productPagination?.totalProducts ?? 0)}
            label="Total Products"
          />
          <StatsCard
            Icon={Users}
            value={String(allUsers?.totalUsers ?? 0)}
            label="Total Users"
          />
          <StatsCard
            Icon={ClipboardList}
            value={String(totalCategoriesCount)}
            label="Total Categories"
          />
        </div>

        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">
              <BarChart2 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            {isAnalyticsLoading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <SalesOverTimeChart data={salesData} />
                <TopProductsChart data={topProducts} />
              </div>
            )}
          </TabsContent>

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

          {/* Orders Tab Content */}
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

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>
                  View user information and manage their roles and permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminUserDataTable
                  users={allUsers?.users || []}
                  isLoading={isFetchingUsers}
                  updateUserAsAdmin={updateUserAsAdmin}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
                <CardDescription>
                  Organize your products by creating, editing, or deleting
                  categories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {categoriesLoading ? (
                  <div className="flex justify-center items-center h-60">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <AdminCategoryDataTable categories={categoryTree || []} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
