export type Artwork = {
  title: string
  description: string
  price: string
  surface: string
}

export const featuredArtworks = [
  "Synthetic Bloom",
  "Neural Coastline",
  "Latent City Study",
]

export const heroSlides = [
  {
    title: "Synthetic Bloom",
    description: "Floral forms shaped through generative color studies.",
  },
  {
    title: "Neural Coastline",
    description: "A calm abstract shoreline rendered from imagined data.",
  },
  {
    title: "Latent City Study",
    description: "Architectural silhouettes from a machine dream sketchbook.",
  },
]

export const featuredStories: Artwork[] = [
  {
    title: "Synthetic Bloom",
    description: "A luminous botanical study generated from layered prompts.",
    price: "$420",
    surface: "bg-muted",
  },
  {
    title: "Neural Coastline",
    description: "Soft horizon forms with imagined oceanic data textures.",
    price: "$680",
    surface: "bg-secondary",
  },
  {
    title: "Latent City Study",
    description: "Architectural silhouettes from a machine dream sketchbook.",
    price: "$540",
    surface: "bg-accent",
  },
  {
    title: "Algorithmic Ember",
    description: "Abstract heat maps rendered as a collectible digital print.",
    price: "$390",
    surface: "bg-input/50",
  },
]

export const artworkCategories = [
  "Minimalist",
  "Abstract",
  "Watercolor",
  "Oil Painting",
  "Vintage",
  "Modern",
  "Contemporary",
  "Line Art",
  "Geometric",
  "Bohemian",
  "Scandinavian",
  "Mid-Century Modern",
  "Retro",
  "Pop Art",
]

const artworkSurfaces = ["bg-muted", "bg-secondary", "bg-accent", "bg-input/50"]

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function createCategoryArtworks(category: string): Artwork[] {
  return ["Study", "Edition", "Composition", "Collection"].map(
    (name, index) => ({
      title: `${category} ${name}`,
      description: `AI generated ${category.toLowerCase()} artwork with gallery-ready digital detail.`,
      price: `$${320 + index * 85}`,
      surface: artworkSurfaces[index],
    })
  )
}

export function getArtworkSlug(artwork: Artwork) {
  return slugify(artwork.title)
}

export const allArtworks = [
  ...featuredStories,
  ...artworkCategories.flatMap((category) => createCategoryArtworks(category)),
]

export function findArtwork(slug?: string) {
  return allArtworks.find((artwork) => getArtworkSlug(artwork) === slug)
}
