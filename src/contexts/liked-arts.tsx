import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react"

import { useAuth } from "@/contexts/auth"
import {
  LikedArtsContext,
  type LikedArtsContextValue,
} from "@/contexts/liked-arts-context"
import {
  getLikedArts,
  setLikedArtState,
  type LikedArt,
} from "@/services/liked-arts"
import { type Product } from "@/types/product"

export function LikedArtsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [likedArts, setLikedArts] = useState<LikedArt[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const refreshLikedArts = useCallback(async () => {
    if (!isAuthenticated) {
      setLikedArts([])
      return
    }

    try {
      setIsLoading(true)
      setLikedArts(await getLikedArts())
    } catch (error) {
      console.error("Error loading liked arts", error)
      setLikedArts([])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      void refreshLikedArts()
    }, 0)

    return () => {
      window.clearTimeout(refreshTimer)
    }
  }, [refreshLikedArts])

  const value = useMemo<LikedArtsContextValue>(
    () => {
      const likedProductIds = new Set(
        likedArts.map((likedArt) => likedArt.product_id)
      )

      return {
        likedArts,
        likedProductIds,
        likedCount: likedArts.length,
        isLiked(productId: number) {
          return likedProductIds.has(productId)
        },
        isLoading,
        refreshLikedArts,
        async toggleLikedArt(product: Product) {
          if (!isAuthenticated) {
            throw new Error("Authentication required")
          }

          const action = likedProductIds.has(product.id)
            ? "disliked"
            : "liked"
          const savedLikedArt = await setLikedArtState(product.id, action)

          setLikedArts((current) => {
            if (action === "liked") {
              const next = current.filter(
                (likedArt) => likedArt.product_id !== product.id
              )

              return [savedLikedArt, ...next]
            }

            return current.filter(
              (likedArt) => likedArt.product_id !== product.id
            )
          })

          return action === "liked"
        },
      }
    },
    [isAuthenticated, isLoading, likedArts, refreshLikedArts]
  )

  return (
    <LikedArtsContext.Provider value={value}>
      {children}
    </LikedArtsContext.Provider>
  )
}
