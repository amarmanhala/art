import { apiWithToken, apiWithoutToken } from "@/services/axios-api"
import { type Product } from "@/types/product"

export type SaveProductVariantPayload = {
  id?: number
  size: string
  price: number
  stock_quantity: number
  is_default?: boolean
}

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
  variants?: SaveProductVariantPayload[]
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

type ProductSizesResponse = {
  data:
    | Array<
        | string
        | {
            id?: number
            size?: string
            label?: string
            name?: string
            price?: number
            stock_quantity?: number
            is_default?: boolean
          }
      >
    | {
        content?: ProductSizeValue[]
        sizes?: ProductSizeValue[]
      }
}

export type ProductSizeValue =
  | string
  | {
      id?: number
      size?: string
      label?: string
      name?: string
      price?: number
      stock_quantity?: number
      is_default?: boolean
    }

export type ProductSizeOption = {
  id?: number
  size: string
  price?: number
  stock_quantity?: number
  is_default?: boolean
}

function normalizeProductSizeValue(value: ProductSizeValue): ProductSizeOption | null {
  if (typeof value === "string") {
    const size = value.trim()
    return size ? { size } : null
  }

  const size = (value.size || value.label || value.name || "").trim()

  if (!size) {
    return null
  }

  return {
    id: value.id,
    size,
    price: value.price,
    stock_quantity: value.stock_quantity,
    is_default: value.is_default,
  }
}

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
  const endpoint =
    typeof idOrSlug === "number"
      ? `/api/v1/products/${idOrSlug}`
      : `/api/products/${idOrSlug}`

  const response = await apiWithoutToken.get<ProductResponse>(endpoint)

  return response.data.data
}

export async function getProductSizes() {
  const response = await apiWithoutToken.get<ProductSizesResponse>(
    "/api/product-sizes"
  )

  const data = response.data.data

  if (Array.isArray(data)) {
    return data
      .map(normalizeProductSizeValue)
      .filter((value): value is ProductSizeOption => Boolean(value))
  }

  const content = data.content || data.sizes || []

  return content
    .map(normalizeProductSizeValue)
    .filter((value): value is ProductSizeOption => Boolean(value))
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
