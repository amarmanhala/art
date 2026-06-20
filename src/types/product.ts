export type Product = {
  id: number
  title: string
  slug: string
  description: string

  category: string
  style: string
  theme: string
  orientation: string
  size: string

  price: number
  currency: string
  stock_quantity: number
  variants?: ProductVariant[]

  image_url: string
  thumbnail_url: string
  original_url: string
  images?: ProductImage[]
  gallery_images?: ProductImage[]
  product_images?: ProductImage[]

  is_active: boolean

  created_at: string
  updated_at: string
}

export type ProductImage = {
  id?: number
  image_url?: string
  thumbnail_url?: string
  original_url?: string
  url?: string
  alt_text?: string
  is_primary?: boolean
}

export type ProductVariant = {
  id?: number
  size: string
  price: number
  stock_quantity: number
  is_default?: boolean
}
