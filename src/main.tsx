import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import { CartProvider } from "@/contexts/cart.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AuthProvider } from "@/contexts/auth-context.tsx"
import { LikedArtsProvider } from "@/contexts/liked-arts.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <LikedArtsProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </LikedArtsProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
  </StrictMode>
)
