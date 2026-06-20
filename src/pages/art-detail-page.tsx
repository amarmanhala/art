import { HeartIcon, ImageIcon, MinusIcon, PlusIcon } from "lucide-react"
import { type MouseEvent } from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { useLikedArts } from "@/contexts/liked-arts-context"
import { getDefaultProductVariant, getProductVariants } from "@/lib/products"
import { cn } from "@/lib/utils"
import {
  getProduct,
  getProductSizes,
  type ProductSizeOption,
} from "@/services/products"
import {
  type Product,
  type ProductImage,
  type ProductVariant,
} from "@/types/product"

function formatProductPrice(product: Product, variant?: ProductVariant | null) {
  const price = variant?.price ?? product.price

  try {
    return `$${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)}`
  } catch {
    return `$${price.toFixed(2)}`
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

type DetailImageState = Record<string, boolean>

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
  const { isLiked, toggleLikedArt } = useLikedArts()
  const [product, setProduct] = useState<Product | null>(null)
  const [cartStatus, setCartStatus] = useState("")
  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi>()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null
  )
  const [productSizes, setProductSizes] = useState<ProductSizeOption[]>([])
  const [isTogglingLike, setIsTogglingLike] = useState(false)
  const [likeAnimationKey, setLikeAnimationKey] = useState(0)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [imageZoomOrigin, setImageZoomOrigin] = useState("50% 50%")
  const [imageLoadState, setImageLoadState] = useState<DetailImageState>({})
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
          const nextVariants = getProductVariants(nextProduct)
          const nextDefaultVariant =
            nextVariants.find((variant) => variant.is_default) ??
            nextVariants[0] ??
            null
          setProduct(nextProduct)
          setSelectedImageIndex(0)
          setSelectedVariantId(nextDefaultVariant?.id ?? null)
          setIsImageZoomed(false)
          setImageZoomOrigin("50% 50%")
          setImageLoadState({})
          setQuantity(1)
          setCartStatus("")
          setIsTogglingLike(false)
          setLikeAnimationKey(0)
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
    let shouldIgnore = false

    async function loadProductSizes() {
      try {
        const sizes = await getProductSizes()

        if (!shouldIgnore) {
          setProductSizes(sizes)
        }
      } catch (error) {
        console.error("Error loading product sizes", error)
      }
    }

    void loadProductSizes()

    return () => {
      shouldIgnore = true
    }
  }, [])

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

  function handleImageLoaded(imageId: string) {
    setImageLoadState((current) =>
      current[imageId] ? current : { ...current, [imageId]: true }
    )
  }

  const detailImages = product ? getProductDetailImages(product) : []
  const hasMultipleImages = detailImages.length > 1
  const activeImage = detailImages[selectedImageIndex] ?? detailImages[0]
  const productVariants = useMemo(
    () => (product ? getProductVariants(product) : []),
    [product]
  )
  const sizeOptions = productSizes.length > 0 ? productSizes : productVariants
  const hasMultipleSizes = sizeOptions.length > 1
  const selectedVariant = useMemo(() => {
    if (!product) {
      return null
    }

    if (!productVariants.length) {
      return getDefaultProductVariant(product)
    }

    return (
      productVariants.find((variant) => variant.id === selectedVariantId) ??
      getDefaultProductVariant(product) ??
      productVariants[0]
    )
  }, [product, productVariants, selectedVariantId])

  const selectedSizeOption = useMemo(() => {
    return (
      sizeOptions.find((sizeOption) => {
        if (selectedVariant?.id && sizeOption.id) {
          return sizeOption.id === selectedVariant.id
        }

        return sizeOption.size === selectedVariant?.size
      }) ??
      sizeOptions[0] ??
      null
    )
  }, [selectedVariant, sizeOptions])

  const maxQuantity = Math.max(
    1,
    Math.min(
      10,
      selectedVariant?.stock_quantity ?? product?.stock_quantity ?? 0
    )
  )
  const selectedQuantity = Math.min(quantity, maxQuantity)
  const selectedSizeLabel =
    selectedSizeOption?.size ||
    selectedVariant?.size ||
    sizeOptions[0]?.size ||
    "-"
  const productDetailRows = [
    ["Style", product?.style || "-"],
    ["Theme", product?.theme || "-"],
    ["Orientation", product?.orientation || "-"],
    ["Category", product?.category || "-"],
  ]

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

  async function handleAddToCart() {
    if (!product) {
      return
    }

    try {
      setIsAddingToCart(true)
      setCartStatus("")
      await addItem(product, selectedVariant, selectedQuantity)
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

  async function handleToggleLike() {
    if (!product) {
      return
    }

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } })
      return
    }

    try {
      setIsTogglingLike(true)
      const liked = await toggleLikedArt(product)

      if (liked) {
        setLikeAnimationKey((current) => current + 1)
      }
    } catch (error) {
      console.error("Error updating liked art", error)
    } finally {
      setIsTogglingLike(false)
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
                        "relative flex aspect-[4/3] min-h-[30rem] items-center justify-center overflow-hidden rounded-2xl bg-white",
                        isImageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                      )}
                      onClick={() => setIsImageZoomed((value) => !value)}
                      onMouseMove={handleImageZoomMove}
                      onMouseLeave={() => {
                        setIsImageZoomed(false)
                        setImageZoomOrigin("50% 50%")
                      }}
                    >
                      {image.thumbnailUrl ? (
                        <img
                          src={image.thumbnailUrl}
                          alt=""
                          aria-hidden="true"
                          loading="eager"
                          decoding="async"
                          className="absolute inset-0 size-full scale-105 object-contain blur-xl"
                          style={{
                            opacity:
                              imageLoadState[image.id] ||
                              image.id !== activeImage?.id
                                ? 0
                                : 1,
                          }}
                        />
                      ) : null}
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
                        onLoad={() => handleImageLoaded(image.id)}
                        className="relative z-10 size-full object-contain transition-[opacity,transform] duration-300"
                        style={{
                          opacity:
                            imageLoadState[image.id] ||
                            image.id !== activeImage?.id
                              ? 1
                              : 0,
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
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-md font-medium">{product.title}</h1>
            <button
              aria-label={
                isLiked(product.id) ? "Remove from likes" : "Like art"
              }
              disabled={isTogglingLike}
              onClick={handleToggleLike}
              type="button"
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-transform duration-150 hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              <span
                key={likeAnimationKey}
                className={cn(
                  "inline-flex items-center justify-center",
                  isLiked(product.id) ? "animate-heart-pop" : ""
                )}
              >
                <HeartIcon
                  aria-hidden="true"
                  className="size-5"
                  fill={isLiked(product.id) ? "currentColor" : "none"}
                />
              </span>
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-md leading-7">{product.description}</p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xl font-semibold">
              {formatProductPrice(product, selectedVariant)}
            </span>
            <div className="flex items-center gap-3 py-4 text-sm">
              <span className="text-sm">Choose size</span>
              {hasMultipleSizes ? (
                <NativeSelect
                  aria-label="Select product size"
                  value={
                    String(
                      selectedSizeOption?.id ??
                        selectedVariant?.id ??
                        selectedSizeOption?.size ??
                        ""
                    ) || ""
                  }
                  onChange={(event) => {
                    const nextValue = event.target.value
                    const nextById = Number(nextValue)

                    if (
                      !Number.isNaN(nextById) &&
                      sizeOptions.some((option) => option.id === nextById)
                    ) {
                      const nextVariant =
                        productVariants.find(
                          (variant) => variant.id === nextById
                        ) ?? null

                      if (nextVariant) {
                        setQuantity((current) =>
                          Math.min(
                            Math.max(1, current),
                            Math.max(
                              1,
                              Math.min(10, nextVariant.stock_quantity)
                            )
                          )
                        )
                      }

                      setSelectedVariantId(nextById)
                      return
                    }

                    const nextSize = sizeOptions.find(
                      (option) => option.size === nextValue
                    )
                    const nextVariant =
                      productVariants.find(
                        (variant) => variant.size === nextSize?.size
                      ) ?? null

                    if (nextVariant) {
                      setQuantity((current) =>
                        Math.min(
                          Math.max(1, current),
                          Math.max(1, Math.min(10, nextVariant.stock_quantity))
                        )
                      )
                      setSelectedVariantId(nextVariant.id ?? null)
                    } else {
                      setSelectedVariantId(null)
                    }
                  }}
                >
                  {sizeOptions.map((option, index) => (
                    <NativeSelectOption
                      key={option.id ?? option.size ?? index}
                      value={String(option.id ?? option.size)}
                    >
                      {option.size}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              ) : (
                <span className="font-medium">{selectedSizeLabel}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-stretch gap-3">
              <ButtonGroup
                aria-label="Quantity"
                className="shrink-0 [&_[data-slot=button-group-text]]:h-12 [&_[data-slot=button-group-text]]:min-w-12 [&_[data-slot=button-group-text]]:justify-center [&_[data-slot=button]]:h-12 [&_[data-slot=button]]:w-12"
              >
                <Button
                  aria-label="Decrease quantity"
                  disabled={selectedQuantity <= 1 || isAddingToCart}
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  size="icon-lg"
                  type="button"
                  variant="outline"
                >
                  <MinusIcon aria-hidden="true" />
                </Button>
                <ButtonGroupText aria-live="polite">
                  {selectedQuantity}
                </ButtonGroupText>
                <Button
                  aria-label="Increase quantity"
                  disabled={selectedQuantity >= maxQuantity || isAddingToCart}
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(maxQuantity, Math.max(1, current) + 1)
                    )
                  }
                  size="icon-lg"
                  type="button"
                  variant="outline"
                >
                  <PlusIcon aria-hidden="true" />
                </Button>
              </ButtonGroup>

              <Button
                className="h-12 flex-1 text-base"
                disabled={isAddingToCart}
                onClick={handleAddToCart}
                size="lg"
              >
                {isAddingToCart
                  ? "Adding..."
                  : selectedQuantity === 1
                    ? "Add to cart"
                    : `Add ${selectedQuantity} items to cart`}
              </Button>
            </div>

            {cartStatus ? (
              <p className="text-sm text-muted-foreground">{cartStatus}</p>
            ) : null}
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex max-w-3xl flex-col gap-6">
          <h2 className="text-2xl">Product details</h2>
          <dl className="grid gap-3 border-y py-6 text-sm">
            {productDetailRows.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <Accordion multiple>
            <AccordionItem value="material-care">
              <AccordionTrigger>Material and care</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Printed with gallery-grade materials selected for crisp detail
                  and long-lasting color. Keep the artwork out of direct
                  sunlight and dust gently with a soft, dry cloth.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping-returns">
              <AccordionTrigger>Shipping & returns</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Ships securely packaged for art handling. Returns are accepted
                  according to the store return policy when the artwork is
                  unused and in original condition.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="measurements">
              <AccordionTrigger>Measurements</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3 text-sm">
                  {sizeOptions.length > 0 ? (
                    sizeOptions.map((option, index) => {
                      const isSelected =
                        option.size === selectedSizeLabel ||
                        (option.id !== undefined &&
                          option.id === selectedSizeOption?.id)

                      return (
                        <div
                          key={option.id ?? option.size ?? index}
                          className="flex items-center justify-between gap-4"
                        >
                          <span className="text-muted-foreground">
                            {option.size}
                          </span>
                          {isSelected ? (
                            <span className="font-medium">Selected</span>
                          ) : null}
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-muted-foreground">
                      Measurements unavailable
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  )
}
