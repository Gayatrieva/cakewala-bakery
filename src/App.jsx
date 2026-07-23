// ─── App.jsx ──────────────────────────────────────────────────────────────────
// Root application component. Manages:
//   - Page routing (single-page navigation via state)
//   - Cart state (add, update qty, remove, clear)
//   - Admin login state
//   - Renders correct page / admin panel based on current route

import { useState, useEffect, useCallback } from "react";

// ── Global styles (injected as <style> tag)
import CSS from "./constants/styles";

// ── Layout components
import Navbar      from "./components/Navbar";
import CartSidebar from "./components/CartSidebar";
import Footer      from "./components/Footer";
import WhatsAppBtn from "./components/WhatsAppBtn";

// ── Customer pages
import HomePage        from "./pages/HomePage";
import CakesPage       from "./pages/CakesPage";
import CakeDetailPage  from "./pages/CakeDetailPage";
import CustomCakePage  from "./pages/CustomCakePage";
import CheckoutPage    from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AboutPage       from "./pages/AboutPage";
import ContactPage     from "./pages/ContactPage";

// ── Admin pages
import AdminLoginPage       from "./admin/AdminLoginPage";
import AdminLayout          from "./admin/AdminLayout";
import AdminDashboard       from "./admin/AdminDashboard";
import AdminOrders          from "./admin/AdminOrders";
import AdminProducts        from "./admin/AdminProducts";
import AdminCustomers       from "./admin/AdminCustomers";
import AdminCustomRequests  from "./admin/AdminCustomRequests";
import AdminTestimonials    from "./admin/AdminTestimonials";

import { CAKES } from "./constants/data";

export default function App() {
  // ── Routing state
  const [page,             setPage]             = useState("home");
  const [selectedCake,     setSelectedCake]     = useState(CAKES[0]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ── Cart state
  const [cart,     setCart]     = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // ── Admin state
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPage,     setAdminPage]     = useState("dashboard");

  // Scroll to top on every page change
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  // ── Navigation helper
  // extra = { cake, category } – optional context passed alongside the page key
  const navigate = useCallback((p, extra = {}) => {
    if (extra.cake)     setSelectedCake(extra.cake);
    if (extra.category) setSelectedCategory(extra.category);
    setPage(p);
    setCartOpen(false);
  }, []);

  // ── Cart helpers
  const addToCart = useCallback((cake, weight, price, flavor, qty = 1, customMsg = "") => {
    setCart(c => {
      const existing = c.find(i => i.id === cake.id && i.selectedWeight === weight && i.selectedFlavor === flavor);
      if (existing) return c.map(i => i === existing ? { ...i, qty: i.qty + qty } : i);
      return [...c, {
        ...cake,
        cartId:        `${cake.id}-${weight}-${flavor}-${Date.now()}`,
        selectedWeight: weight,
        selectedPrice:  price,
        selectedFlavor: flavor,
        qty,
        customMsg,
      }];
    });
  }, []);

  const updateQty = useCallback((cartId, qty) => {
    if (qty < 1) setCart(c => c.filter(i => i.cartId !== cartId));
    else         setCart(c => c.map(i => i.cartId === cartId ? { ...i, qty } : i));
  }, []);

  const removeFromCart = useCallback((cartId) => setCart(c => c.filter(i => i.cartId !== cartId)), []);
  const clearCart      = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // ── Route flags
  const isAdminPage  = page.startsWith("admin") && page !== "admin-login";

  // ────────────────────────────────────────────────────────────────────────────
  // Admin Login screen (full-page, no navbar/footer)
  // ────────────────────────────────────────────────────────────────────────────
  if (page === "admin-login") return (
    <>
      <style>{CSS}</style>
      <AdminLoginPage onLogin={() => { setAdminLoggedIn(true); setPage("admin"); setAdminPage("dashboard"); }} />
    </>
  );

  // ────────────────────────────────────────────────────────────────────────────
  // Admin Panel (sidebar layout, no customer navbar/footer)
  // ────────────────────────────────────────────────────────────────────────────
  if (isAdminPage) return (
    <>
      <style>{CSS}</style>
      <AdminLayout
        adminPage={adminPage}
        setAdminPage={setAdminPage}
        onLogout={() => { setAdminLoggedIn(false); setPage("home"); }}
        navigate={navigate}
      >
        {adminPage === "dashboard"        && <AdminDashboard />}
        {adminPage === "orders"           && <AdminOrders />}
        {adminPage === "products"         && <AdminProducts />}
        {adminPage === "customers"        && <AdminCustomers />}
        {adminPage === "custom-requests"  && <AdminCustomRequests />}
        {adminPage === "testimonials"     && <AdminTestimonials />}
      </AdminLayout>
    </>
  );

  // ────────────────────────────────────────────────────────────────────────────
  // Customer-facing site (navbar + footer)
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: "#FEF8F2", minHeight: "100vh" }}>

        {/* Top navigation bar */}
        <Navbar
          page={page}
          navigate={navigate}
          cartCount={cartCount}
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          adminLoggedIn={adminLoggedIn}
        />

        {/* Cart sidebar (shown as overlay) */}
        {cartOpen && (
          <CartSidebar
            cart={cart}
            updateQty={updateQty}
            removeFromCart={removeFromCart}
            setCartOpen={setCartOpen}
            navigate={navigate}
          />
        )}

        {/* Page content */}
        <main>
          {page === "home"          && <HomePage       navigate={navigate} addToCart={addToCart} setCartOpen={setCartOpen} />}
          {page === "cakes"         && <CakesPage      navigate={navigate} addToCart={addToCart} initCategory={selectedCategory} />}
          {page === "cake-detail"   && <CakeDetailPage cake={selectedCake} navigate={navigate} addToCart={addToCart} setCartOpen={setCartOpen} />}
          {page === "custom-cake"   && <CustomCakePage navigate={navigate} />}
          {page === "checkout"      && <CheckoutPage   cart={cart} navigate={navigate} clearCart={clearCart} />}
          {page === "order-success" && <OrderSuccessPage navigate={navigate} />}
          {page === "about"         && <AboutPage />}
          {page === "contact"       && <ContactPage />}
        </main>

        {/* Footer */}
        <Footer navigate={navigate} />

        {/* Floating WhatsApp button */}
        <WhatsAppBtn cart={cart} />

        {/* Hidden admin access button (bottom-left corner) */}
        <button onClick={() => navigate("admin-login")}
          style={{ position: "fixed", bottom: 28, left: 28, background: "#FFE8EF", border: "1px solid #F0D5DF", borderRadius: 999, padding: "6px 14px", fontSize: ".72rem", color: "#7B4560", cursor: "pointer", fontWeight: 600, opacity: .7 }}>
          Admin
        </button>
      </div>
    </>
  );
}
