import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import ShopByCategory from "./components/ShopByCategory";
import WhyChooseUs from "./components/WhyChooseUs";
import BestSellers from "./components/BestSellers";
import PromoBanner from "./components/PromoBanner";
import Newsletter from "./components/Newsletter";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import { ShopProvider } from "./context/ShopContext";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Privacy from "./pages/Privacy";
import PublicLayout from "./layouts/PublicLayout";

//ADMIN PAGES
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminWishlistAnalytics from "./admin/pages/AdminWishlistAnalytics";
import AdminCustomers from "./admin/pages/AdminCustomers";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminActivityLogs from "./admin/pages/AdminActivityLogs";
import AdminNewsletter from "./admin/pages/AdminNewsletter";
import AdminContactMessages from "./admin/pages/AdminContactMessages";

function App() {
  return (
  <BrowserRouter>
  <ShopProvider>
    <Routes>
      <Route element={<PublicLayout />}>
      <Route path="/" element={
        <main>
          <Hero />
          <ShopByCategory />
          <WhyChooseUs />
          <BestSellers />
          <PromoBanner />
          <Newsletter />
        </main>
      }/>
      <Route path="/shop" element={<Shop />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/returns" element={<Returns />} />
      <Route path="/privacy" element={<Privacy />} />
      </Route>
      
      {/* Admin routes will be added here */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      }/>
      <Route path="/admin/products" element={
        <AdminProtectedRoute>
          <AdminProducts />
          </AdminProtectedRoute>
      }/>
      <Route path="/admin/orders" element={
        <AdminProtectedRoute>
          <AdminOrders />
        </AdminProtectedRoute>
      }/>
      <Route path="/admin/wishlist" element={
        <AdminProtectedRoute>
          <AdminWishlistAnalytics />
          </AdminProtectedRoute>
      }/>
        
        <Route path="/admin/wishlist-analytics" element={
          <AdminProtectedRoute>
            <AdminWishlistAnalytics />
            </AdminProtectedRoute>
        }/>

        <Route path="/admin/customers" element={
          <AdminProtectedRoute>
            <AdminCustomers />
            </AdminProtectedRoute>
        }/>

        <Route path="/admin/settings" element={
          <AdminProtectedRoute>
            <AdminSettings />
            </AdminProtectedRoute>
        }/>

        <Route path="/admin/activity-logs" element={
          <AdminProtectedRoute>
            <AdminActivityLogs />
            </AdminProtectedRoute>
        }/>

        <Route path="/admin/newsletter" element={
          <AdminProtectedRoute>
            <AdminNewsletter />
            </AdminProtectedRoute>
        }/>

        <Route path="/admin/contact-messages" element={
          <AdminProtectedRoute>
            <AdminContactMessages />
            </AdminProtectedRoute>
        }/>

    </Routes>
  </ShopProvider>
  </BrowserRouter>
);

}

export default App;