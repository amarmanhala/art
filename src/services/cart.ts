import { apiWithToken } from "@/services/axios-api"
import { type Product, type ProductVariant } from "@/types/product"

export type CartProduct = Pick<
  Product,
  "id" | "title" | "slug" | "image_url" | "thumbnail_url"
> &
  Partial<
    Pick<Product, "description" | "price" | "currency" | "original_url">
  >

export type CartProductVariant = Pick<
  ProductVariant,
  "id" | "size" | "price" | "stock_quantity" | "is_default"
>

export type CartItem = {
  id: number
  cart_id: number
  product: CartProduct
  variant?: CartProductVariant | null
  product_variant?: CartProductVariant | null
  productVariant?: CartProductVariant | null
  quantity: number
  subtotal: number
}

export type Cart = {
  id: number
  user_id: number
  items: CartItem[]
  total_items: number
  total_price: number
}

type CartResponse = {
  data: Cart
}

type StripeCheckoutSessionResponse = {
  data: {
    checkout_url: string
    session_id: string
    order_id: number
    order_number: string
    expires_at: string
  }
}

export async function getCart() {
  const response = await apiWithToken.get<CartResponse>("/api/cart")

  return response.data.data
}

export async function addCartItem(productVariantId: number, quantity = 1) {
  const response = await apiWithToken.post<CartResponse>("/api/cart/items", {
    product_variant_id: productVariantId,
    quantity,
  })

  return response.data.data
}

export async function updateCartItem(itemId: number, quantity: number) {
  const response = await apiWithToken.put<CartResponse>(
    `/api/cart/items/${itemId}`,
    { quantity }
  )

  return response.data.data
}

export async function deleteCartItem(itemId: number) {
  const response = await apiWithToken.delete<CartResponse>(
    `/api/cart/items/${itemId}`
  )

  return response.data.data
}

export async function clearCart() {
  const response = await apiWithToken.delete<CartResponse>("/api/cart")

  return response.data.data
}

export async function createStripeCheckoutSession() {
  const response = await apiWithToken.post<StripeCheckoutSessionResponse>(
    "/api/checkout/stripe/session"
  )

  return response.data.data
}
