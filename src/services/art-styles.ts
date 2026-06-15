import { apiWithToken, apiWithoutToken } from "@/services/axios-api"

export type ArtStyle = {
  id: number
  origin: string
  style: string
  description: string
  tags: string[]
  image_url: string
  blob_name: string
  created_at?: string
  updated_at?: string
}

export type SaveArtStylePayload = {
  origin: string
  style: string
  description: string
  tags: string[]
  image_url: string
  blob_name: string
}

type ArtStylesResponse = {
  data:
    | ArtStyle[]
    | {
        content?: ArtStyle[]
        items?: ArtStyle[]
      }
}

type ArtStyleResponse = {
  data: ArtStyle
}

export async function getArtStyles() {
  const response = await apiWithoutToken.get<ArtStylesResponse>("/api/styles")
  const data = response.data.data

  if (Array.isArray(data)) {
    return data
  }

  return data.content || data.items || []
}

export async function createArtStyle(payload: SaveArtStylePayload) {
  const response = await apiWithToken.post<ArtStyleResponse>(
    "/api/styles",
    payload
  )

  return response.data.data
}

export async function updateArtStyle(id: number, payload: SaveArtStylePayload) {
  const response = await apiWithToken.put<ArtStyleResponse>(
    `/api/styles/${id}`,
    payload
  )

  return response.data.data
}

export async function patchArtStyle(
  id: number,
  payload: Partial<SaveArtStylePayload>
) {
  const response = await apiWithToken.patch<ArtStyleResponse>(
    `/api/styles/${id}`,
    payload
  )

  return response.data.data
}

export async function deleteArtStyle(id: number) {
  await apiWithToken.delete(`/api/styles/${id}`)
}
