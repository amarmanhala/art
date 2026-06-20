import { type CartItem } from "@/services/cart"
import { type Product, type ProductVariant } from "@/types/product"

function isDefinedVariant(
  variant: ProductVariant | null | undefined
): variant is ProductVariant {
  return Boolean(variant && variant.size.trim())
}

export function getProductVariants(product: Product) {
  return Array.isArray(product.variants)
    ? product.variants.filter(isDefinedVariant)
    : []
}

export function getDefaultProductVariant(product: Product) {
  const variants = getProductVariants(product)

  if (variants.length === 0) {
    return null
  }

  return variants.find((variant) => variant.is_default) ?? variants[0]
}

export function getProductDisplayVariant(product: Product) {
  return getDefaultProductVariant(product)
}

export function getProductDisplayPrice(product: Product) {
  const variant = getProductDisplayVariant(product)

  return variant?.price ?? product.price
}

export function getProductDisplaySize(product: Product) {
  const variant = getProductDisplayVariant(product)

  return variant?.size ?? product.size
}

export function getProductDisplayStockQuantity(product: Product) {
  const variant = getProductDisplayVariant(product)

  return variant?.stock_quantity ?? product.stock_quantity
}

export function getCartItemVariant(item: CartItem) {
  return item.product_variant ?? item.variant ?? item.productVariant ?? null
}
