import { apiWithToken, apiWithoutToken } from "@/services/axios-api"

export type CarouselItem = {
  id: number
  title: string
  description: string
  image_url: string
  blob_name: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type SaveCarouselItemPayload = {
  title: string
  description: string
  image_url: string
  blob_name: string
  sort_order: number
  is_active: boolean
}

type CarouselResponse = {
  data: CarouselItem[]
}

export async function getCarouselItems() {
  const response = await apiWithoutToken.get<CarouselResponse>("/api/carousel")

  return response.data.data
}

export async function saveCarouselItems(items: SaveCarouselItemPayload[]) {
  const response = await apiWithToken.put<CarouselResponse>(
    "/api/carousel",
    { items }
  )

  return response.data.data
}

type CarouselItemResponse = {
  data: CarouselItem
}

export async function getAdminCarouselItems() {
  const response = await apiWithToken.get<CarouselResponse>(
    "/api/admin/carousel"
  )

  return response.data.data
}

export async function createCarouselItem(payload: SaveCarouselItemPayload) {
  const response = await apiWithToken.post<CarouselItemResponse>(
    "/api/admin/carousel",
    payload
  )

  return response.data.data
}

export async function updateCarouselItem(
  id: number,
  payload: SaveCarouselItemPayload
) {
  const response = await apiWithToken.put<CarouselItemResponse>(
    `/api/admin/carousel/${id}`,
    payload
  )

  return response.data.data
}

export async function updateCarouselItemStatus(id: number, isActive: boolean) {
  const response = await apiWithToken.patch<CarouselItemResponse>(
    `/api/admin/carousel/${id}/status`,
    { is_active: isActive }
  )

  return response.data.data
}

export async function deleteCarouselItem(id: number) {
  await apiWithToken.delete(`/api/admin/carousel/${id}`)
}
