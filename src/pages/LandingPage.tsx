// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/authContext";
// import { useProduct } from "@/contexts/productContext";

// import type { Product } from "../types";

// // UI Components
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// // Page Components
// import { SectionHeader } from "@/components/PageComponents/SectionHeader";
// import { StatsCard } from "../components/PageComponents/StatsCard";

// // Icons
// import {
//   BookOpen,
//   Users,
//   Feather,
//   ArrowRight,
//   WandSparkles,
//   NotebookText,
//   PenTool,
//   Palette,
//   AlertTriangle, // Icon for error messages
// } from "lucide-react";

// // Reusable Product Card Component
// const ProductCard = ({ product }: { product: Product }) => (
//   // Link now uses the product's ID, which the controller expects
//   <Link to={`/products/${product.id}`} className="group">
//     <Card className="h-full overflow-hidden transition-all duration-300 group-hover:border-primary group-hover:shadow-xl">
//       <CardContent className="p-0">
//         <div className="w-full h-64 bg-secondary">
//           {product.imageUrl ? (
//             <img
//               src={product.imageUrl}
//               alt={product.name}
//               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//             />
//           ) : (
//             // Fallback for missing images
//             <div className="w-full h-full flex items-center justify-center text-muted-foreground">
//               <BookOpen className="w-10 h-10" />
//             </div>
//           )}
//         </div>
//         <div className="p-4">
//           <h4 className="font-bold truncate" title={product.name}>
//             {product.name}
//           </h4>
//           <p className="text-sm text-muted-foreground">
//             {product.type === "book"
//               ? product.details?.author || "Unknown Author"
//               : product.details?.brand || "Premium Brand"}
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   </Link>
// );

// export default function LandingPage() {
//   const { isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const { products, isLoading, error, fetchAllProducts } = useProduct();

//   const [featuredBooks, setFeaturedBooks] = useState<Product[]>([]);
//   const [featuredStationery, setFeaturedStationery] = useState<Product[]>([]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/user/home");
//     } else {
//       // Fetch the 6 newest items, which is compatible with the controller's default sorting.
//       fetchAllProducts({ limit: 6, sortBy: "createdAt", sortOrder: "DESC" });
//     }
//   }, [isAuthenticated, navigate, fetchAllProducts]);

//   useEffect(() => {
//     if (products && products.length > 0) {
//       const books = products
//         .filter((p) => p.productType === "Books")
//         .slice(0, 2);
//       const stationery = products
//         .filter((p) => p.productType === "Stationary")
//         .slice(0, 4);
//       setFeaturedBooks(books);
//       setFeaturedStationery(stationery);
//     }
//   }, [products]);

//   return (
//     <>
//       {/* --- Hero Section --- */}
//       <section className="relative overflow-hidden py-20 text-center">
//         <div className="container mx-auto px-4 relative">
//           <div className="max-w-4xl mx-auto">
//             <Badge
//               variant="secondary"
//               className="px-4 py-2 text-sm font-medium mb-6"
//             >
//               <WandSparkles className="w-4 h-4 mr-2" />
//               For Readers & Creators
//             </Badge>
//             <h1 className="text-4xl md:text-6xl font-bold mb-6">
//               Where Stories Are <br />
//               <span className="text-primary">Written & Read</span>
//             </h1>
//             <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
//               From captivating novels to premium journals, pens, and art
//               supplies, find the tools to feed your imagination.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button
//                 size="lg"
//                 className="px-8 py-6 text-lg rounded-xl"
//                 asChild
//               >
//                 <Link to="/books">
//                   Explore Books <ArrowRight className="ml-2 w-5 h-5" />
//                 </Link>
//               </Button>
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="px-8 py-6 text-lg rounded-xl"
//                 asChild
//               >
//                 <Link to="/stationery">Explore Stationery</Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- Our Collections Section --- */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <SectionHeader
//             title="Our Collections"
//             subtitle="Everything you need, whether you're diving into a new world or creating your own."
//           />
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             <Link to="/books" className="group">
//               <Card className="h-full hover:border-primary transition-all">
//                 <CardHeader className="items-center text-center">
//                   <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary transition-all">
//                     <BookOpen className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-all" />
//                   </div>
//                   <CardTitle>Books</CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-center text-muted-foreground">
//                   Explore thousands of titles across all genres.
//                 </CardContent>
//               </Card>
//             </Link>
//             <Link to="/stationery/journals" className="group">
//               <Card className="h-full hover:border-primary transition-all">
//                 <CardHeader className="items-center text-center">
//                   <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary transition-all">
//                     <NotebookText className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-all" />
//                   </div>
//                   <CardTitle>Journals</CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-center text-muted-foreground">
//                   Perfect for notes, plans, and daily reflections.
//                 </CardContent>
//               </Card>
//             </Link>
//             <Link to="/stationery/pens" className="group">
//               <Card className="h-full hover:border-primary transition-all">
//                 <CardHeader className="items-center text-center">
//                   <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary transition-all">
//                     <PenTool className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-all" />
//                   </div>
//                   <CardTitle>Pens & Pencils</CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-center text-muted-foreground">
//                   Find the perfect writing tool for every task.
//                 </CardContent>
//               </Card>
//             </Link>
//             <Link to="/stationery/art-supplies" className="group">
//               <Card className="h-full hover:border-primary transition-all">
//                 <CardHeader className="items-center text-center">
//                   <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary transition-all">
//                     <Palette className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-all" />
//                   </div>
//                   <CardTitle>Art Supplies</CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-center text-muted-foreground">
//                   Unleash your inner artist with paints and brushes.
//                 </CardContent>
//               </Card>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* --- Featured Products Section --- */}
//       <section className="py-20 bg-muted/30">
//         <div className="container mx-auto px-4">
//           <SectionHeader
//             title="New & Noteworthy"
//             subtitle="Discover our latest arrivals and creative tools loved by the community."
//           />

//           {isLoading && (
//             <div className="text-center text-lg text-muted-foreground">
//               Loading our latest products...
//             </div>
//           )}

//           {error && (
//             <Alert variant="destructive" className="max-w-2xl mx-auto">
//               <AlertTriangle className="h-4 w-4" />
//               <AlertTitle>Something Went Wrong</AlertTitle>
//               <AlertDescription>
//                 We couldn't load our new products. Please try refreshing the
//                 page.
//               </AlertDescription>
//             </Alert>
//           )}

//           {!isLoading && !error && (
//             <>
//               {featuredBooks.length === 0 && featuredStationery.length === 0 ? (
//                 <div className="text-center text-muted-foreground">
//                   No new items to show right now. Check back soon!
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//                   {featuredBooks.length > 0 && (
//                     <div>
//                       <h3 className="text-2xl font-bold mb-6 text-center lg:text-left">
//                         Latest Reads
//                       </h3>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                         {featuredBooks.map((book) => (
//                           <ProductCard key={book.id} product={book} />
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {featuredStationery.length > 0 && (
//                     <div>
//                       <h3 className="text-2xl font-bold mb-6 text-center lg:text-left">
//                         Creative Tools
//                       </h3>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                         {featuredStationery.map((item) => (
//                           <ProductCard key={item.id} product={item} />
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </section>

//       {/* --- Stats Section --- */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <StatsCard Icon={BookOpen} value="50,000+" label="Curated Books" />
//             <StatsCard Icon={Feather} value="10,000+" label="Creative Tools" />
//             <StatsCard Icon={Users} value="1M+" label="Happy Customers" />
//           </div>
//         </div>
//       </section>

//       {/* --- Final CTA Section --- */}
//       <section className="py-20 bg-muted/30">
//         <div className="container mx-auto px-4 relative">
//           <Card className="max-w-4xl mx-auto bg-background/50 border-0 shadow-sm">
//             <CardContent className="p-12 text-center">
//               <h2 className="text-3xl md:text-4xl font-bold mb-4">
//                 Ready to Start a New Chapter?
//               </h2>
//               <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
//                 Join our community of book lovers and creators. Get personalized
//                 recommendations, exclusive offers, and a dash of inspiration
//                 delivered to your inbox.
//               </p>
//               <Button
//                 size="lg"
//                 className="px-8 py-6 text-lg rounded-xl"
//                 asChild
//               >
//                 <Link to="/register">
//                   Join The Community <ArrowRight className="ml-2 w-5 h-5" />
//                 </Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </section>
//     </>
//   );
// }
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { useProduct } from "@/contexts/productContext";

import type { Product } from "../types";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { SectionHeader } from "@/components/PageComponents/SectionHeader";
import { StatsCard } from "../components/PageComponents/StatsCard";
import { ProductCard } from "../components/PageComponents/product/ProductCard"; // Adjust path if needed

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Links to filtered pages */}
            <Link to="/home?category=Books" className="group">
              <Card className="h-full hover:border-primary transition-all">
                <CardHeader className="items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary transition-all">
                    <BookOpen className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-all" />
                  </div>
                  <CardTitle>Books</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Explore thousands of titles across all genres.
                </CardContent>
              </Card>
            </Link>
            <Link to="/home?category=Stationery" className="group">
              <Card className="h-full hover:border-primary transition-all">
                <CardHeader className="items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary transition-all">
                    <NotebookText className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-all" />
                  </div>
                  <CardTitle>Stationery</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Journals, pens, and art supplies for every task.
                </CardContent>
              </Card>
            </Link>
            {/* You can add more specific collection links if needed */}
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
                  {/* 3. USE the new ProductCard and pass the required props */}
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
