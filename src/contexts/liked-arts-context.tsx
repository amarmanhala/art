import { createContext, useContext } from "react"

import { type LikedArt } from "@/services/liked-arts"
import { type Product } from "@/types/product"

export type LikedArtsContextValue = {
  likedArts: LikedArt[]
  likedProductIds: Set<number>
  likedCount: number
  isLiked: (productId: number) => boolean
  isLoading: boolean
  refreshLikedArts: () => Promise<void>
  toggleLikedArt: (product: Product) => Promise<boolean>
}

export const LikedArtsContext = createContext<LikedArtsContextValue | null>(
  null
)

export function useLikedArts() {
  const context = useContext(LikedArtsContext)

  if (!context) {
    throw new Error("useLikedArts must be used within a LikedArtsProvider")
  }

  return context
}
