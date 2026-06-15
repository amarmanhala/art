import { ImageIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { type Artwork, getArtworkSlug } from "@/data/artworks"
import { type Product } from "@/types/product"

type ArtworkSectionProps =
  | {
      title: string
      artworks: Artwork[]
      products?: never
      showViewAllButton?: boolean
      showTitle?: boolean
    }
  | {
      title: string
      products: Product[]
      artworks?: never
      showViewAllButton?: boolean
      showTitle?: boolean
    }

type SectionItem = {
  key: string | number
  title: string
  description: string
  price: string
  slug: string
  category: string
  imageUrl?: string
  showDescription: boolean
  surface?: string
}

function formatProductPrice(product: Product) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product.currency || "USD",
    }).format(product.price)
  } catch {
    return `${product.currency} ${product.price}`
  }
}

export function ArtworkSection({
  title,
  artworks,
  products,
  showViewAllButton = true,
  showTitle = true,
}: ArtworkSectionProps) {
  const items: SectionItem[] = products
    ? products.map((product) => ({
        key: product.id,
        title: product.title,
        description: product.description,
        price: formatProductPrice(product),
        slug: product.slug || String(product.id),
        category: product.theme,
        imageUrl: product.thumbnail_url || product.image_url,
        showDescription: false,
      }))
    : artworks.map((artwork) => ({
        key: artwork.title,
        title: artwork.title,
        description: artwork.description,
        price: artwork.price,
        slug: getArtworkSlug(artwork),
        category: "AI Generated Artwork",
        showDescription: true,
        surface: artwork.surface,
      }))

  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-14">
      {showTitle ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium">{title}</h2>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <article key={item.key} className="flex flex-col gap-3">
            <Link
              to={`/art/${item.slug}`}
              className={`flex aspect-[3/2] min-h-72 items-center justify-center overflow-hidden rounded-2xl border ${item.surface ?? "bg-muted"}`}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <ImageIcon aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">
                    Artwork placeholder {index + 1}
                  </p>
                </div>
              )}
            </Link>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                {item.category}
              </p>
              <Link to={`/art/${item.slug}`}>
                <h2 className="text-xl leading-tight font-medium">
                  {item.title}
                </h2>
              </Link>
              {item.showDescription ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
              <p className="font-medium">{item.price}</p>
            </div>
          </article>
        ))}
      </div>

      {showViewAllButton ? (
        <Button
          className="w-fit"
          nativeButton={false}
          render={<Link to="/art" />}
        >
          View all arts
        </Button>
      ) : null}
    </section>
  )
}
