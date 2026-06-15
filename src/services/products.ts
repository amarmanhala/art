import { apiWithToken, apiWithoutToken } from "@/services/axios-api"
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

type ProductResponse = {
  data: Product
}

type ProductImagesResponse = {
  data: Product
}

export type ProductImageSavePayload = {
  main_image: {
    blob_name: string
    alt_text: string
  }
  gallery_images: Array<{
    blob_name: string
    alt_text: string
  }>
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

export type GetProductsParams = {
  page?: number
  size?: number
  q?: string
  style?: string
}

export async function getProducts(params: GetProductsParams = {}) {
  const { page = 0, size = 10, q, style } = params
  const response = await apiWithoutToken.get<ProductsResponse>(
    "/api/products",
    {
      params: {
        page,
        size,
        ...(q ? { q } : {}),
        ...(q ? { search: q } : {}),
        ...(style ? { style } : {}),
      },
    }
  )

  return response.data.data
}

export async function getProduct(idOrSlug: number | string) {
  const response = await apiWithoutToken.get<ProductResponse>(
    `/api/products/${idOrSlug}`
  )

  return response.data.data
}

export async function createProduct(payload: CreateProductPayload) {
  const response = await apiWithToken.post<CreateProductResponse>(
    "/api/products",
    payload
  )

  return response.data.data
}

export async function updateProduct(
  idOrSlug: number | string,
  payload: UpdateProductPayload
) {
  const response = await apiWithToken.patch<UpdateProductResponse>(
    `/api/products/${idOrSlug}`,
    payload
  )

  return response.data.data
}

export async function deleteProduct(idOrSlug: number | string) {
  await apiWithToken.delete(`/api/products/${idOrSlug}`)
}

export async function addProductImages(
  id: number,
  payload: ProductImageSavePayload
) {
  const response = await apiWithToken.post<ProductImagesResponse>(
    `/api/admin/products/${id}/images`,
    payload
  )

  return response.data.data
}

export async function replaceProductImages(
  id: number,
  payload: ProductImageSavePayload
) {
  const response = await apiWithToken.put<ProductImagesResponse>(
    `/api/admin/products/${id}/images`,
    payload
  )

  return response.data.data
}
