import { useEffect } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { QuoteSection } from "@/components/layout/quote-section"
import { useAuth } from "@/contexts/auth"
import { AdminPage } from "@/pages/admin-page"
import { ArtDetailPage } from "@/pages/art-detail-page"
import { CartPage } from "@/pages/cart-page"
import { HomePage } from "@/pages/home-page"
import { LoginPage } from "@/pages/login-page"
import { PlaceholderPage } from "@/pages/placeholder-page"
import { SignupPage } from "@/pages/signup-page"

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
    <>
      <ScrollToTop />
      {isAdminPage ? null : <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buy" element={<PlaceholderPage title="Buy AI Art" />} />
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
        <Route path="/admin" element={<ProtectedAdminRoute />} />
        <Route path="/admin/orders" element={<ProtectedAdminRoute />} />
        <Route path="/admin/products/new" element={<ProtectedAdminRoute />} />
        <Route
          path="/admin/products/:idOrSlug/edit"
          element={<ProtectedAdminRoute />}
        />
      </Routes>
      {isHomePage ? <QuoteSection /> : null}
      {isAdminPage || isAuthPage ? null : <Footer />}
    </>
  )
}

export default App
