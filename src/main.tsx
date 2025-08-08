import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext.tsx";
import { ThemeProvider } from "./contexts/themeContext.tsx";
import { ProductProvider } from "./contexts/productContext.tsx";
import { CategoryProvider } from "./contexts/categoryContext.tsx";
import { ReviewProvider } from "./contexts/reviewContext.tsx";
import { CartProvider } from "./contexts/cartContext.tsx";

import { Toaster } from "react-hot-toast";
import { OrderProvider } from "./contexts/orderContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CategoryProvider>
            <ReviewProvider>
              <CartProvider>
                <OrderProvider>
                  <ThemeProvider>
                    <App />
                    <Toaster
                      position="bottom-right"
                      toastOptions={{
                        duration: 3000,
                        style: {
                          background: "#363636",
                          color: "#fff",
                        },
                        success: {
                          duration: 2000,
                          iconTheme: {
                            primary: "green",
                            secondary: "black",
                          },
                        },
                      }}
                    />
                  </ThemeProvider>
                </OrderProvider>
              </CartProvider>
            </ReviewProvider>
          </CategoryProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
