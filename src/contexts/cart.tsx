import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react"

import { useAuth } from "@/contexts/auth"
import { CartContext, type CartContextValue } from "@/contexts/cart-context"
import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getCart,
  type Cart,
  updateCartItem,
} from "@/services/cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null)
      return
    }

    try {
      setIsLoading(true)
      setCart(await getCart())
    } catch (error) {
      console.error("Error loading cart", error)
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      void refreshCart()
    }, 0)

    return () => {
      window.clearTimeout(refreshTimer)
    }
  }, [refreshCart])

  const value = useMemo<CartContextValue>(
    () => ({
      async addItem(product, quantity = 1) {
        if (!isAuthenticated) {
          throw new Error("Authentication required")
        }

        setCart(await addCartItem(product.id, quantity))
      },
      cart,
      async clearItems() {
        if (!isAuthenticated) {
          return
        }

        setCart(await clearCart())
      },
      itemCount: cart?.total_items ?? 0,
      isLoading,
      items: cart?.items ?? [],
      refreshCart,
      async removeItem(itemId) {
        if (!isAuthenticated) {
          return
        }

        setCart(await deleteCartItem(itemId))
      },
      totalPrice: cart?.total_price ?? 0,
      async updateItem(itemId, quantity) {
        if (!isAuthenticated) {
          return
        }

        setCart(await updateCartItem(itemId, quantity))
      },
    }),
    [cart, isAuthenticated, isLoading, refreshCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
