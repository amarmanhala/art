import { useState } from "react"

import { Button } from "@/components/ui/button"
import { type ArtStyle } from "@/services/art-styles"

export function ArtStyleSection({ styles }: { styles: ArtStyle[] }) {
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(0)
  const selectedStyle = styles[selectedStyleIndex] ?? styles[0]

  if (!selectedStyle) {
    return null
  }

  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14">
      <div className="flex flex-col gap-8">
        <h2 className="pb-4 text-xl font-normal">The Art of Japan</h2>
        <div className="flex flex-wrap gap-2">
          {styles.map((style, index) => (
            <Button
              key={style.id}
              type="button"
              variant={selectedStyleIndex === index ? "default" : "outline"}
              onClick={() => setSelectedStyleIndex(index)}
            >
              {style.style}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid items-center gap-12 pt-14 lg:grid-cols-2">
        <div className="flex max-w-xl flex-col gap-5">
          <p className="max-w-lg text-lg leading-8 text-foreground">
            {selectedStyle.description}
          </p>
          <Button className="w-fit">Explore art</Button>
        </div>

        <div className="relative aspect-[4/3] min-h-72 overflow-hidden rounded-3xl border md:min-h-[28rem] lg:min-h-[30rem]">
          <img
            src={selectedStyle.image_url}
            alt={selectedStyle.style}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
