import { ImageIcon } from "lucide-react"
import { useParams } from "react-router-dom"

import { ArtworkSection } from "@/components/artwork/artwork-section"
import { Button } from "@/components/ui/button"
import { allArtworks, featuredStories, findArtwork } from "@/data/artworks"

export function ArtDetailPage() {
  const { slug } = useParams()
  const artwork = findArtwork(slug) ?? featuredStories[0]
  const similarArtworks = allArtworks
    .filter((item) => item.title !== artwork.title)
    .slice(0, 4)

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_28rem]">
        <div
          className={`flex aspect-[4/3] min-h-[30rem] items-center justify-center rounded-2xl border ${artwork.surface}`}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <ImageIcon aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Artwork placeholder</p>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              AI Generated Artwork
            </p>
            <h1 className="text-4xl font-medium">{artwork.title}</h1>
            <p className="text-base leading-7 text-muted-foreground">
              {artwork.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 border-y py-6">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="text-3xl font-medium">{artwork.price}</span>
          </div>

          <div className="grid gap-3">
            <Button>Add to cart</Button>
            <Button variant="outline">Make an offer</Button>
          </div>

          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Format</dt>
              <dd className="font-medium">Digital print</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Edition</dt>
              <dd className="font-medium">1 of 25</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">License</dt>
              <dd className="font-medium">Personal use</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex max-w-3xl flex-col gap-8">
          <h2 className="text-4xl font-medium">About this art</h2>
          <div className="flex flex-col gap-7 text-lg leading-9">
            <p>
              {artwork.title} explores how prompts, model interpretation, and
              human selection can become part of a collectible visual language.
              The piece is composed as a calm digital object that can sit in a
              modern collection without losing the traces of its algorithmic
              origin.
            </p>
            <p>
              Each placeholder work in this marketplace represents how the final
              store can connect AI generation, curation, licensing, and purchase
              flows. The current content is mock data, ready to be replaced by
              generated images and metadata from your integration.
            </p>
          </div>
        </div>
      </section>

      <ArtworkSection title="Similar Arts" artworks={similarArtworks} />
    </main>
  )
}
