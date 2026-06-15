import { createContext, useContext } from "react"

import { type Cart, type CartItem } from "@/services/cart"
import { type Product } from "@/types/product"

export type CartContextValue = {
  addItem: (product: Product, quantity?: number) => Promise<void>
  cart: Cart | null
  clearItems: () => Promise<void>
  itemCount: number
  items: CartItem[]
  isLoading: boolean
  refreshCart: () => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  totalPrice: number
  updateItem: (itemId: number, quantity: number) => Promise<void>
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}
