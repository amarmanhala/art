import { Link } from "react-router-dom"

import { ArtworkSection } from "@/components/artwork/artwork-section"
import { Button } from "@/components/ui/button"
import { useLikedArts } from "@/contexts/liked-arts-context"

export function LikedArtsPage() {
  const { likedArts, likedCount, isLoading, refreshLikedArts } =
    useLikedArts()
  const likedProducts = likedArts.map((likedArt) => likedArt.product)

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-medium">Liked arts</h1>
        <p className="text-sm text-muted-foreground">
          {likedCount} item{likedCount === 1 ? "" : "s"} liked.
        </p>
      </div>

      {isLoading ? (
        <div className="min-h-80 rounded-2xl bg-muted" />
      ) : likedCount > 0 ? (
        <ArtworkSection
          title="Liked arts"
          products={likedProducts}
          showTitle={false}
          showViewAllButton={false}
        />
      ) : (
        <div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-2xl border bg-background text-center">
          <p className="text-lg font-medium">No liked arts yet</p>
          <Button nativeButton={false} render={<Link to="/art" />}>
            Browse art
          </Button>
        </div>
      )}

      {likedCount > 0 ? (
        <Button variant="outline" className="w-fit" onClick={() => void refreshLikedArts()}>
          Refresh
        </Button>
      ) : null}
    </main>
  )
}
