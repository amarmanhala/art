import { ArtworkSection } from "@/components/artwork/artwork-section"
import { type Product } from "@/types/product"

export function BestsellerSection({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return null
  }

  return <ArtworkSection title="Bestseller" products={products} />
}
