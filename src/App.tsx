import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";

import { CartProvider } from "./context/CartContext";
import { LoadingScreen } from "./components/LoadingScreen";
import { VerticalNav } from "./components/VerticalNav";
import { CartDrawer } from "./components/CartDrawer";

import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { MenuScanPage } from "./pages/MenuScanPage";
import { AboutPage } from "./pages/AboutPage";
import { OrderPage } from "./pages/OrderPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminPage } from "./pages/AdminPage";
import { KitchenPage } from "./pages/KitchenPage";
import { NotFound } from "./pages/NotFound";

const queryClient = new QueryClient();

const Shell = () => {
  const location = useLocation();
  const isStandalone = location.pathname.startsWith("/admin") || location.pathname.startsWith("/kitchen") || location.pathname.startsWith("/cuisine");

  if (isStandalone) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="/cuisine" element={<KitchenPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <>
      <VerticalNav />
      <CartDrawer />
      <main className="md:ml-20 pb-16 md:pb-0 flex min-h-screen flex-col items-center overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/scan" element={<MenuScanPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/commander" element={<OrderPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

export const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
          <BrowserRouter>
            <Shell />
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
