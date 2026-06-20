import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import { useAuth } from "@/contexts/auth"
import { CartContext, type CartContextValue } from "@/contexts/cart-context"
import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getCart,
  type Cart,
  type CartItem,
  type CartProduct,
  type CartProductVariant,
  updateCartItem,
} from "@/services/cart"
import { getDefaultProductVariant, getProductVariants } from "@/lib/products"
import { type Product, type ProductVariant } from "@/types/product"

const guestCartStorageKey = "guest_cart"

function getGuestCartItemId(productVariantId: number) {
  return -productVariantId
}

function getItemSubtotal(item: CartItem) {
  const variant = item.product_variant ?? item.variant ?? item.productVariant
  const unitPrice = variant?.price ?? item.product.price ?? 0

  return unitPrice * item.quantity
}

function buildCart(items: CartItem[]): Cart {
  const normalizedItems = items.map((item) => ({
    ...item,
    subtotal: getItemSubtotal(item),
  }))

  return {
    id: 0,
    user_id: 0,
    items: normalizedItems,
    total_items: normalizedItems.reduce(
      (total, item) => total + item.quantity,
      0
    ),
    total_price: normalizedItems.reduce(
      (total, item) => total + item.subtotal,
      0
    ),
  }
}

function readGuestCart() {
  try {
    const storedCart = localStorage.getItem(guestCartStorageKey)

    if (!storedCart) {
      return buildCart([])
    }

    const items = JSON.parse(storedCart) as CartItem[]

    return buildCart(Array.isArray(items) ? items : [])
  } catch {
    localStorage.removeItem(guestCartStorageKey)
    return buildCart([])
  }
}

function writeGuestCart(cart: Cart) {
  localStorage.setItem(guestCartStorageKey, JSON.stringify(cart.items))
}

function clearGuestCart() {
  localStorage.removeItem(guestCartStorageKey)
}

function getCartProduct(product: Product): CartProduct {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: product.price,
    currency: product.currency,
    image_url: product.image_url,
    thumbnail_url: product.thumbnail_url,
    original_url: product.original_url,
  }
}

function getCartProductVariant(variant: ProductVariant): CartProductVariant {
  return {
    id: variant.id,
    size: variant.size,
    price: variant.price,
    stock_quantity: variant.stock_quantity,
    is_default: variant.is_default,
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(readGuestCart())
      return
    }

    try {
      setIsLoading(true)
      const guestCart = readGuestCart()

      if (guestCart.items.length > 0) {
        let syncedCart: Cart | null = null

        for (const item of guestCart.items) {
          const variant =
            item.product_variant ?? item.variant ?? item.productVariant

          if (variant?.id) {
            syncedCart = await addCartItem(variant.id, item.quantity)
          }
        }

        clearGuestCart()
        setCart(syncedCart ?? (await getCart()))
        return
      }

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
      async addItem(product, variant, quantity = 1) {
        const resolvedVariant =
          variant ??
          getDefaultProductVariant(product) ??
          getProductVariants(product)[0]

        if (!resolvedVariant?.id) {
          throw new Error("Product variant is required")
        }

        if (!isAuthenticated) {
          setCart((currentCart) => {
            const current = currentCart ?? readGuestCart()
            const itemId = getGuestCartItemId(resolvedVariant.id)
            const existingItem = current.items.find(
              (item) => item.id === itemId
            )
            const nextItems = existingItem
              ? current.items.map((item) =>
                  item.id === itemId
                    ? {
                        ...item,
                        quantity: Math.min(10, item.quantity + quantity),
                      }
                    : item
                )
              : [
                  ...current.items,
                  {
                    id: itemId,
                    cart_id: 0,
                    product: getCartProduct(product),
                    variant: getCartProductVariant(resolvedVariant),
                    product_variant: getCartProductVariant(resolvedVariant),
                    productVariant: getCartProductVariant(resolvedVariant),
                    quantity,
                    subtotal: 0,
                  },
                ]
            const nextCart = buildCart(nextItems)

            writeGuestCart(nextCart)
            return nextCart
          })
          return
        }

        setCart(await addCartItem(resolvedVariant.id, quantity))
      },
      cart,
      async clearItems() {
        if (!isAuthenticated) {
          const nextCart = buildCart([])
          clearGuestCart()
          setCart(nextCart)
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
          setCart((currentCart) => {
            const current = currentCart ?? readGuestCart()
            const nextCart = buildCart(
              current.items.filter((item) => item.id !== itemId)
            )

            writeGuestCart(nextCart)
            return nextCart
          })
          return
        }

        setCart(await deleteCartItem(itemId))
      },
      totalPrice: cart?.total_price ?? 0,
      async updateItem(itemId, quantity) {
        if (!isAuthenticated) {
          setCart((currentCart) => {
            const current = currentCart ?? readGuestCart()
            const nextQuantity = Math.min(10, Math.max(1, quantity))
            const nextCart = buildCart(
              current.items.map((item) =>
                item.id === itemId ? { ...item, quantity: nextQuantity } : item
              )
            )

            writeGuestCart(nextCart)
            return nextCart
          })
          return
        }

        setCart(await updateCartItem(itemId, quantity))
      },
    }),
    [cart, isAuthenticated, isLoading, refreshCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
