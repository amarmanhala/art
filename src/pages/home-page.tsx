import { Link } from "react-router-dom"

import { ArtworkSection } from "@/components/artwork/artwork-section"
import { Button } from "@/components/ui/button"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { heroSlides } from "@/data/artworks"
import {
  getCarouselItems,
  type CarouselItem as ApiCarouselItem,
} from "@/services/carousel"
import getFeaturedProducts from "@/services/featured-products"
import { type Product } from "@/types/product"
import { useEffect, useState } from "react"

type StaticHeroSlide = (typeof heroSlides)[number]

function isApiCarouselItem(
  slide: ApiCarouselItem | StaticHeroSlide
): slide is ApiCarouselItem {
  return "image_url" in slide && typeof slide.image_url === "string"
}

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [carouselItems, setCarouselItems] = useState<ApiCarouselItem[]>([])
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [selectedSlide, setSelectedSlide] = useState(0)

  useEffect(() => {
    let shouldIgnore = false

    async function loadHomePageData() {
      const [products, carousel] = await Promise.all([
        getFeaturedProducts(),
        getCarouselItems(),
      ])

      if (!shouldIgnore) {
        setFeaturedProducts(products.slice(0, 4))
        setCarouselItems(carousel)
      }
    }

    loadHomePageData()

    return () => {
      shouldIgnore = true
    }
  }, [])

  useEffect(() => {
    if (!carouselApi) {
      return
    }

    function updateSelectedSlide() {
      setSelectedSlide(carouselApi?.selectedScrollSnap() ?? 0)
    }

    updateSelectedSlide()
    carouselApi.on("select", updateSelectedSlide)
    carouselApi.on("reInit", updateSelectedSlide)

    return () => {
      carouselApi.off("select", updateSelectedSlide)
      carouselApi.off("reInit", updateSelectedSlide)
    }
  }, [carouselApi])

  const activeCarouselItem = carouselItems[selectedSlide]
  const fallbackSlide = heroSlides[selectedSlide] ?? heroSlides[0]
  const hasCarouselItems = carouselItems.length > 0

  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-10 md:py-14 lg:grid-cols-2">
        <div className="flex max-w-xl flex-col gap-8">
          <div className="flex flex-col gap-5">
            <p className="max-w-lg text-lg leading-8 text-foreground">
              {activeCarouselItem?.description ||
                fallbackSlide.description ||
                "Discover original digital works shaped by artists, prompts, and intelligent tools."}
            </p>
            <p className="text-sm text-foreground">
              {activeCarouselItem?.title || fallbackSlide.title}
            </p>
          </div>
          <Button
            className="w-fit"
            nativeButton={false}
            render={<Link to="/buy" />}
          >
            Explore Art
          </Button>
        </div>

        <Carousel
          className="w-full"
          opts={{ loop: true }}
          setApi={setCarouselApi}
        >
          <CarouselContent>
            {(hasCarouselItems ? carouselItems : heroSlides).map((slide) => (
              <CarouselItem key={slide.title}>
                {isApiCarouselItem(slide) ? (
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="aspect-[4/3] min-h-72 w-full rounded-3xl border object-cover md:min-h-[28rem] lg:min-h-[30rem]"
                  />
                ) : (
                  <div
                    className="aspect-[4/3] min-h-72 rounded-3xl border bg-muted md:min-h-[28rem] lg:min-h-[30rem]"
                    aria-label={slide.title}
                  />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" variant="outline" />
          <CarouselNext className="right-4" variant="outline" />
        </Carousel>
      </section>

      {featuredProducts.length > 0 ? (
        <ArtworkSection title="Featured Products" products={featuredProducts} />
      ) : null}
    </main>
  )
}
