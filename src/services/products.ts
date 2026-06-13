import { apiWithoutToken } from "@/services/axios-api"
import { type Product } from "@/types/product"

export type CreateProductPayload = {
  title: string
  slug: string
  description: string
  price: number
  currency: string
  category: string
  style: string
  theme: string
  orientation: string
  size: string
  image_url: string
  thumbnail_url: string
  original_url: string
  stock_quantity: number
  is_active: boolean
}

export type UpdateProductPayload = Partial<CreateProductPayload>

type CreateProductResponse = {
  data: Product
}

type UpdateProductResponse = {
  data: Product
}

type ProductsResponse = {
  data: {
    content: Product[]
    page: number
    size: number
    total_elements: number
    total_pages: number
    first: boolean
    last: boolean
  }
}

export type ProductsPage = ProductsResponse["data"]

export async function getProducts(page = 0, size = 10) {
  const response = await apiWithoutToken.get<ProductsResponse>(
    "/api/products",
    {
      params: { page, size },
    }
  )

  return response.data.data
}

export async function createProduct(payload: CreateProductPayload) {
  const response = await apiWithoutToken.post<CreateProductResponse>(
    "/api/products",
    payload
  )

  return response.data.data
}

export async function updateProduct(
  idOrSlug: number | string,
  payload: UpdateProductPayload
) {
  const response = await apiWithoutToken.patch<UpdateProductResponse>(
    `/api/products/${idOrSlug}`,
    payload
  )

  return response.data.data
}

export async function deleteProduct(idOrSlug: number | string) {
  await apiWithoutToken.delete(`/api/products/${idOrSlug}`)
}
