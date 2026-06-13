import { featuredArtworks } from "@/data/artworks"

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="px-6 py-8">
      <div className="flex max-w-3xl flex-col gap-4">
        <h1 className="text-2xl font-medium">{title}</h1>
        <ul className="flex flex-col gap-2 text-muted-foreground">
          {featuredArtworks.map((artwork) => (
            <li key={artwork}>{artwork}</li>
          ))}
        </ul>
      </div>
    </main>
  )
}
