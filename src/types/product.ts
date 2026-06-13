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

  image_url: string
  thumbnail_url: string
  original_url: string

  is_active: boolean

  created_at: string
  updated_at: string
}
