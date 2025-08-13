import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { useProduct } from "@/contexts/productContext";

import type { Product } from "../types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { SectionHeader } from "@/components/PageComponents/SectionHeader";
import { StatsCard } from "../components/PageComponents/StatsCard";
import { ProductCard } from "../components/PageComponents/product/ProductCard";

import {
  BookOpen,
  Users,
  Feather,
  ArrowRight,
  WandSparkles,
  NotebookText,
  AlertTriangle,
} from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { paginatedData, isLoading, error, fetchAllProducts } = useProduct();

  const [featuredBooks, setFeaturedBooks] = useState<Product[]>([]);
  const [featuredStationery, setFeaturedStationery] = useState<Product[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    } else {
      fetchAllProducts({ limit: 6, sortBy: "createdAt", sortOrder: "DESC" });
    }
  }, [isAuthenticated, navigate, fetchAllProducts]);
  useEffect(() => {
    const products = paginatedData?.products;
    console.log("products: ", products);
    if (products && products.length > 0) {
      const books = products
        .filter((p) => p.category?.parentId === 1)
        .slice(0, 2);
      const stationery = products
        .filter((p) => p.category?.parentId === 2)
        .slice(0, 4);
      setFeaturedBooks(books);
      setFeaturedStationery(stationery);
    }
  }, [paginatedData]);

  return (
    <>
      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden py-20 text-center">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium mb-6"
            >
              <WandSparkles className="w-4 h-4 mr-2" />
              For Readers & Creators
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Where Stories Are <br />
              <span className="text-primary">Written & Read</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              From captivating novels to premium journals, pens, and art
              supplies, find the tools to feed your imagination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-6 text-lg rounded-xl"
              >
                <Link to="/home">
                  Explore Products <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Our Collections Section --- */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Collections"
            subtitle="Everything you need, whether you're diving into a new world or creating your own."
          />
          <div className="flex flex-wrap justify-center items-center gap-8 p-4 md:p-8">
            {/* Links to filtered pages */}
            <Link to="/home?category=Books" className="group">
              <Card className="h-full hover:border-primary transition-all">
                <CardHeader className="items-center text-center">
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary transition-all">
                    {" "}
                    <BookOpen className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-all" />
                    <CardTitle className="font-bold">Books</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Explore thousands of titles across all genres.
                </CardContent>
              </Card>
            </Link>
            <Link to="/home?category=Stationery" className="group">
              <Card className="h-full hover:border-primary transition-all">
                <CardHeader className="items-center text-center">
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary transition-all">
                    {" "}
                    <NotebookText className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-all" />
                    <CardTitle className="font-bold">Stationery</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Journals, pens, and art supplies for every task.
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* --- Featured Products Section --- */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="New & Noteworthy"
            subtitle="Discover our latest arrivals and creative tools loved by the community."
          />

          {isLoading && (
            <div className="text-center text-lg text-muted-foreground">
              Loading our latest products...
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Something Went Wrong</AlertTitle>
              <AlertDescription>
                We couldn't load our new products. Please try refreshing the
                page.
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && (
            <>
              {featuredBooks.length === 0 && featuredStationery.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No new items to show right now. Check back soon!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredBooks.map((book) => (
                    <ProductCard
                      key={book.id}
                      product={book}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                  {featuredStationery.map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* --- Stats Section --- */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatsCard Icon={BookOpen} value="50,000+" label="Curated Books" />
            <StatsCard Icon={Feather} value="10,000+" label="Creative Tools" />
            <StatsCard Icon={Users} value="1M+" label="Happy Customers" />
          </div>
        </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 relative">
          <Card className="max-w-4xl mx-auto bg-background/50 border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start a New Chapter?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our community of book lovers and creators. Get personalized
                recommendations, exclusive offers, and a dash of inspiration
                delivered to your inbox.
              </p>
              <Button
                asChild
                size="lg"
                className="px-8 py-6 text-lg rounded-xl"
              >
                <Link to="/register">
                  Join The Community <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
