import { apiWithToken } from "@/services/axios-api"
import { type Product } from "@/types/product"

export type LikedArtStatus = "liked" | "disliked"

export type LikedArt = {
  id: number
  user_id: number
  product_id: number
  status: LikedArtStatus
  product: Product
  created_at: string
  updated_at: string
}

type LikedArtsResponse = {
  data: LikedArt[]
}

type LikedArtResponse = {
  data: LikedArt
}

export async function getLikedArts() {
  const response = await apiWithToken.get<LikedArtsResponse>("/api/liked-arts")

  return response.data.data
}

export async function setLikedArtState(
  productId: number,
  action: LikedArtStatus
) {
  const response = await apiWithToken.post<LikedArtResponse>(
    "/api/liked-arts",
    {
      product_id: productId,
      action,
    }
  )

  return response.data.data
}
