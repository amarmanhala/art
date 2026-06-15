import { ImageIcon } from "lucide-react"
import { type MouseEvent } from "react"
import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { useAuth } from "@/contexts/auth"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"
import { getProduct } from "@/services/products"
import { type Product, type ProductImage } from "@/types/product"

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

function isUnauthorizedError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "status" in error.response &&
    error.response.status === 401
  )
}

type DetailImage = {
  id: string
  url: string
  thumbnailUrl: string
  alt: string
}

function getProductImageUrl(image: ProductImage) {
  return image.image_url || image.original_url || image.url || ""
}

function getProductThumbnailUrl(image: ProductImage) {
  return image.thumbnail_url || getProductImageUrl(image)
}

function getProductDetailImages(product: Product) {
  const images =
    product.images || product.gallery_images || product.product_images || []
  const primaryUrl = product.image_url || product.original_url
  const detailImages: DetailImage[] = []
  const usedUrls = new Set<string>()

  if (primaryUrl) {
    detailImages.push({
      id: "primary",
      url: primaryUrl,
      thumbnailUrl: product.thumbnail_url || primaryUrl,
      alt: product.title,
    })
    usedUrls.add(primaryUrl)
  }

  images.forEach((image, index) => {
    const url = getProductImageUrl(image)

    if (!url || usedUrls.has(url)) {
      return
    }

    detailImages.push({
      id: image.id ? String(image.id) : `gallery-${index}`,
      url,
      thumbnailUrl: getProductThumbnailUrl(image),
      alt: image.alt_text || product.title,
    })
    usedUrls.add(url)
  })

  return detailImages
}

export function ArtDetailPage() {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [cartStatus, setCartStatus] = useState("")
  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi>()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [imageZoomOrigin, setImageZoomOrigin] = useState("50% 50%")
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let shouldIgnore = false

    async function loadProductDetail() {
      if (!slug) {
        setErrorMessage("Product could not be found.")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setErrorMessage("")

        const nextProduct = await getProduct(slug)

        if (!shouldIgnore) {
          setProduct(nextProduct)
          setSelectedImageIndex(0)
          setIsImageZoomed(false)
          setImageZoomOrigin("50% 50%")
          setQuantity(1)
          setCartStatus("")
        }
      } catch (error) {
        console.error("Error loading product detail", error)

        if (!shouldIgnore) {
          setErrorMessage("Product could not be loaded.")
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false)
        }
      }
    }

    loadProductDetail()

    return () => {
      shouldIgnore = true
    }
  }, [slug])

  useEffect(() => {
    if (!mainCarouselApi) {
      return
    }

    function handleSelect() {
      setSelectedImageIndex(mainCarouselApi?.selectedScrollSnap() ?? 0)
      setIsImageZoomed(false)
      setImageZoomOrigin("50% 50%")
    }

    handleSelect()
    mainCarouselApi.on("select", handleSelect)
    mainCarouselApi.on("reInit", handleSelect)

    return () => {
      mainCarouselApi.off("select", handleSelect)
      mainCarouselApi.off("reInit", handleSelect)
    }
  }, [mainCarouselApi])

  const selectImage = useCallback(
    (index: number) => {
      setSelectedImageIndex(index)
      setIsImageZoomed(false)
      setImageZoomOrigin("50% 50%")
      mainCarouselApi?.scrollTo(index)
    },
    [mainCarouselApi]
  )

  function handleImageZoomMove(event: MouseEvent<HTMLDivElement>) {
    if (!isImageZoomed) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setImageZoomOrigin(`${x}% ${y}%`)
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12">
        <div className="min-h-[30rem] rounded-2xl border bg-muted" />
      </main>
    )
  }

  if (errorMessage || !product) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-12">
        <h1 className="text-3xl font-medium">Product not found</h1>
        <p className="text-muted-foreground">
          {errorMessage || "Product could not be found."}
        </p>
      </main>
    )
  }

  const detailImages = getProductDetailImages(product)
  const hasMultipleImages = detailImages.length > 1

  async function handleAddToCart() {
    if (!product) {
      return
    }

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } })
      return
    }

    try {
      setIsAddingToCart(true)
      setCartStatus("")
      await addItem(product, quantity)
    } catch (error) {
      console.error("Error adding product to cart", error)
      if (isUnauthorizedError(error)) {
        navigate("/login", { state: { from: location } })
        return
      }
      setCartStatus("Product could not be added to cart.")
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_28rem]">
        <div className="relative flex flex-col gap-4 md:block md:pl-[6.5rem]">
          {hasMultipleImages ? (
            <Carousel
              opts={{ align: "start" }}
              orientation="vertical"
              className="order-2 min-h-0 md:absolute md:inset-y-0 md:left-0 md:order-none md:w-[5.5rem] md:[&_[data-slot=carousel-content]]:h-full"
            >
              <CarouselContent className="-mt-3 h-80 md:h-full">
                {detailImages.map((image, index) => {
                  const isSelected = index === selectedImageIndex

                  return (
                    <CarouselItem
                      key={image.id}
                      className="basis-auto pt-3 md:basis-1/4"
                    >
                      <button
                        type="button"
                        aria-label={`Show ${image.alt}`}
                        aria-pressed={isSelected}
                        className={cn(
                          "flex aspect-square size-20 items-center justify-center overflow-hidden rounded-lg bg-white transition md:size-full",
                          isSelected
                            ? "ring-2 ring-foreground/25"
                            : "ring-0 hover:ring-2 hover:ring-foreground/15"
                        )}
                        onClick={() => selectImage(index)}
                      >
                        <img
                          src={image.thumbnailUrl}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="size-full object-contain"
                        />
                      </button>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="top-2" />
              <CarouselNext className="bottom-2" />
            </Carousel>
          ) : null}

          <Carousel
            setApi={setMainCarouselApi}
            className="order-1 md:order-none"
            opts={{ align: "start" }}
          >
            {detailImages.length > 0 ? (
              <CarouselContent>
                {detailImages.map((image) => (
                  <CarouselItem key={image.id}>
                    <div
                      className={cn(
                        "flex aspect-[4/3] min-h-[30rem] items-center justify-center overflow-hidden rounded-2xl bg-white",
                        isImageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                      )}
                      onClick={() => setIsImageZoomed((value) => !value)}
                      onMouseMove={handleImageZoomMove}
                      onMouseLeave={() => {
                        setIsImageZoomed(false)
                        setImageZoomOrigin("50% 50%")
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        loading={
                          image.id === detailImages[0]?.id ? "eager" : "lazy"
                        }
                        fetchPriority={
                          image.id === detailImages[0]?.id ? "high" : "auto"
                        }
                        decoding="async"
                        className="size-full object-contain transition-transform duration-200"
                        style={{
                          transform: isImageZoomed ? "scale(1.6)" : "scale(1)",
                          transformOrigin: imageZoomOrigin,
                        }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            ) : (
              <div className="flex aspect-[4/3] min-h-[30rem] flex-col items-center justify-center gap-3 rounded-2xl bg-white text-center">
                <ImageIcon aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  Product image unavailable
                </p>
              </div>
            )}
            {hasMultipleImages ? (
              <>
                <CarouselPrevious className="top-1/2 left-4 -translate-y-1/2" />
                <CarouselNext className="top-1/2 right-4 -translate-y-1/2" />
              </>
            ) : null}
          </Carousel>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-md font-medium">{product.title}</h1>
            <p className="text-md leading-7">{product.description}</p>
          </div>

          <div className="flex items-center justify-between gap-4 py-6">
            <span className="text-xl">{formatProductPrice(product)}</span>
            <label className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Qty</span>
              <NativeSelect
                aria-label="Quantity"
                value={String(quantity)}
                onChange={(event) => setQuantity(Number(event.target.value))}
              >
                {Array.from({ length: 10 }, (_, index) => index + 1).map(
                  (option) => (
                    <NativeSelectOption key={option} value={option}>
                      {option}
                    </NativeSelectOption>
                  )
                )}
              </NativeSelect>
            </label>
          </div>

          <div className="grid gap-3">
            <Button
              size="lg"
              disabled={isAddingToCart}
              onClick={handleAddToCart}
            >
              {isAddingToCart ? "Adding..." : "Add to cart"}
            </Button>

            {cartStatus ? (
              <p className="text-sm text-muted-foreground">{cartStatus}</p>
            ) : null}
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex max-w-3xl flex-col gap-8">
          <h2 className="text-2xl">About this art</h2>
          <dl className="grid gap-3 border-y py-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Style</dt>
              <dd className="font-medium">{product.style || "-"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Theme</dt>
              <dd className="font-medium">{product.theme || "-"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Orientation</dt>
              <dd className="font-medium">{product.orientation || "-"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Size</dt>
              <dd className="font-medium">{product.size || "-"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Stock</dt>
              <dd className="font-medium">{product.stock_quantity}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Category</dt>
              <dd className="font-medium">{product.category || "-"}</dd>
            </div>
          </dl>
          <div className="flex flex-col gap-7 text-lg leading-9">
            <p>{product.description}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
