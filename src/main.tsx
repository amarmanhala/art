import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import { CartProvider } from "@/contexts/cart.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AuthProvider } from "@/contexts/auth-context.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
