import { Link } from "react-router-dom"

import { ArtStyleSection } from "@/components/art-style-section"
import { BestsellerSection } from "@/components/bestseller-section"
import { Button } from "@/components/ui/button"
import { heroSlides } from "@/data/artworks"
import { cn } from "@/lib/utils"
import {
  getCarouselItems,
  type CarouselItem as ApiCarouselItem,
} from "@/services/carousel"
import { getArtStyles, type ArtStyle } from "@/services/art-styles"
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
  const [artStyles, setArtStyles] = useState<ArtStyle[]>([])
  const [selectedSlide, setSelectedSlide] = useState(0)

  useEffect(() => {
    let shouldIgnore = false

    async function loadHomePageData() {
      const [products, carousel, styles] = await Promise.all([
        getFeaturedProducts(),
        getCarouselItems(),
        getArtStyles(),
      ])

      if (!shouldIgnore) {
        setFeaturedProducts(products.slice(0, 4))
        setCarouselItems(carousel)
        setArtStyles(styles)
      }
    }

    loadHomePageData()

    return () => {
      shouldIgnore = true
    }
  }, [])

  const hasCarouselItems = carouselItems.length > 0
  const carouselSlides = hasCarouselItems ? carouselItems : heroSlides
  const visibleSlide = selectedSlide % carouselSlides.length
  const activeSlide = carouselSlides[visibleSlide] ?? carouselSlides[0]
  const fallbackSlide = heroSlides[visibleSlide] ?? heroSlides[0]

  useEffect(() => {
    if (carouselSlides.length <= 1) {
      return
    }

    const slideTimer = window.setInterval(() => {
      setSelectedSlide((currentSlide) =>
        currentSlide + 1 >= carouselSlides.length ? 0 : currentSlide + 1
      )
    }, 5000)

    return () => {
      window.clearInterval(slideTimer)
    }
  }, [carouselSlides.length])

  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-10 md:py-14 lg:grid-cols-2">
        <div className="flex max-w-xl flex-col gap-8">
          <div className="flex flex-col gap-5">
            <p className="max-w-lg text-lg leading-8 text-foreground">
              {activeSlide?.description ||
                fallbackSlide.description ||
                "Discover original digital works shaped by artists, prompts, and intelligent tools."}
            </p>
            <p className="text-sm text-foreground">
              {activeSlide?.title || fallbackSlide.title}
            </p>
          </div>
          <Button
            className="w-fit"
            nativeButton={false}
            render={<Link to="/art" />}
          >
            Shop Arts
          </Button>
        </div>

        <div className="w-full">
          <div className="relative aspect-[4/3] min-h-72 overflow-hidden rounded-3xl border md:min-h-[28rem] lg:min-h-[30rem]">
            {carouselSlides.map((slide, index) =>
              isApiCarouselItem(slide) ? (
                <img
                  key={slide.title}
                  src={slide.image_url}
                  alt={slide.title}
                  loading={index === visibleSlide ? "eager" : "lazy"}
                  fetchPriority={index === visibleSlide ? "high" : "auto"}
                  decoding="async"
                  className={cn(
                    "absolute inset-0 size-full object-cover transition-opacity duration-700 ease-in-out",
                    visibleSlide === index ? "opacity-100" : "opacity-0"
                  )}
                />
              ) : (
                <div
                  key={slide.title}
                  className={cn(
                    "absolute inset-0 size-full bg-muted transition-opacity duration-700 ease-in-out",
                    visibleSlide === index ? "opacity-100" : "opacity-0"
                  )}
                  aria-label={slide.title}
                />
              )
            )}
          </div>
          {carouselSlides.length > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-2">
              {carouselSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={cn(
                    "size-2.5 rounded-full transition-colors",
                    visibleSlide === index
                      ? "bg-foreground"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={visibleSlide === index ? "true" : undefined}
                  onClick={() => setSelectedSlide(index)}
                >
                  <span className="sr-only">Go to slide {index + 1}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <BestsellerSection products={featuredProducts} />
      <ArtStyleSection styles={artStyles} />
    </main>
  )
}
