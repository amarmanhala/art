import { Route, Routes, useLocation } from "react-router-dom"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { QuoteSection } from "@/components/layout/quote-section"
import { AdminPage } from "@/pages/admin-page"
import { ArtDetailPage } from "@/pages/art-detail-page"
import { CartPage } from "@/pages/cart-page"
import { HomePage } from "@/pages/home-page"
import { LoginPage } from "@/pages/login-page"
import { PlaceholderPage } from "@/pages/placeholder-page"
import { SignupPage } from "@/pages/signup-page"

export function App() {
  const location = useLocation()
  const isArtDetailPage = location.pathname.startsWith("/art/")
  const isAdminPage = location.pathname.startsWith("/admin")

  return (
    <>
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
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/orders" element={<AdminPage />} />
        <Route path="/admin/products/new" element={<AdminPage />} />
        <Route path="/admin/products/:idOrSlug/edit" element={<AdminPage />} />
      </Routes>
      {isArtDetailPage || isAdminPage ? null : <QuoteSection />}
      {isAdminPage ? null : <Footer />}
    </>
  )
}

export default App
