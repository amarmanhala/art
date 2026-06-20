import { useEffect } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { QuoteSection } from "@/components/layout/quote-section"
import { useAuth } from "@/contexts/auth"
import { AdminPage } from "@/pages/admin-page"
import { AboutPage } from "@/pages/about-page"
import { ArtDetailPage } from "@/pages/art-detail-page"
import { CartPage } from "@/pages/cart-page"
import { CheckoutPage } from "@/pages/checkout-page"
import { CheckoutCancelPage } from "@/pages/checkout-cancel-page"
import { CheckoutSuccessPage } from "@/pages/checkout-success-page"
import { ContactPage } from "@/pages/contact-page"
import { HomePage } from "@/pages/home-page"
import { LikedArtsPage } from "@/pages/liked-arts-page"
import { LoginPage } from "@/pages/login-page"
import { OrderTrackingPage } from "@/pages/order-tracking-page"
import { PlaceholderPage } from "@/pages/placeholder-page"
import { PrivacyPage } from "@/pages/privacy-page"
import { ReturnsPage } from "@/pages/returns-page"
import { ShopArtsPage } from "@/pages/shop-arts-page"
import { SignupPage } from "@/pages/signup-page"
import { TermsPage } from "@/pages/terms-page"

function ProtectedAdminRoute() {
  const location = useLocation()
  const { isAdmin, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <AdminPage />
}

function ProtectedLikedArtsRoute() {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <LikedArtsPage />
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname])

  return null
}

export function App() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith("/admin")
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup"
  const isHomePage = location.pathname === "/"

  return (
    <div className="flex min-h-svh flex-col">
      <ScrollToTop />
      {isAdminPage ? null : <Header />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/art" element={<ShopArtsPage />} />
          <Route
            path="/artists"
            element={<PlaceholderPage title="AI Artists" />}
          />
          <Route
            path="/collections"
            element={<PlaceholderPage title="Collections" />}
          />
          <Route
            path="/editorial"
            element={<PlaceholderPage title="Editorial" />}
          />
          <Route path="/art/:slug" element={<ArtDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/liked-arts" element={<ProtectedLikedArtsRoute />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
          <Route path="/order-status" element={<OrderTrackingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/admin" element={<ProtectedAdminRoute />} />
          <Route path="/admin/orders" element={<ProtectedAdminRoute />} />
          <Route path="/admin/customers" element={<ProtectedAdminRoute />} />
          <Route path="/admin/products/new" element={<ProtectedAdminRoute />} />
          <Route
            path="/admin/products/:idOrSlug/edit"
            element={<ProtectedAdminRoute />}
          />
        </Routes>
      </div>
      {isHomePage ? <QuoteSection /> : null}
      {isAdminPage || isAuthPage ? null : <Footer />}
    </div>
  )
}

export default App
