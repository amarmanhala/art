import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { ArtworkSection } from "@/components/artwork/artwork-section"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getArtStyles, type ArtStyle } from "@/services/art-styles"
import { getProducts, type ProductsPage } from "@/services/products"
import { type Product } from "@/types/product"

const pageSize = 12

const emptyProductsPage: ProductsPage = {
  content: [],
  page: 0,
  size: pageSize,
  total_elements: 0,
  total_pages: 0,
  first: true,
  last: true,
}

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase()
}

function productMatchesSearch(product: Product, searchQuery: string) {
  const query = normalizeSearchValue(searchQuery)

  if (!query) {
    return true
  }

  return [
    product.title,
    product.description,
    product.slug,
    product.category,
    product.style,
    product.theme,
    product.orientation,
    product.size,
    ...(product.variants?.map((variant) => variant.size) ?? []),
  ]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(query))
}

function productMatchesStyle(product: Product, style: string) {
  return !style || product.style.toLowerCase() === style.toLowerCase()
}

export function ShopArtsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [productsPage, setProductsPage] =
    useState<ProductsPage>(emptyProductsPage)
  const [artStyles, setArtStyles] = useState<ArtStyle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const searchQuery = searchParams.get("q")?.trim() ?? ""
  const selectedStyle = searchParams.get("style") ?? "all"
  const productStyle = selectedStyle === "all" ? "" : selectedStyle
  const pageFromParams = Number(searchParams.get("page") ?? "0")
  const page =
    Number.isInteger(pageFromParams) && pageFromParams >= 0 ? pageFromParams : 0
  const hasActiveFilters = searchQuery.length > 0 || productStyle.length > 0
  const visibleProducts = productsPage.content.filter(
    (product) =>
      productMatchesSearch(product, searchQuery) &&
      productMatchesStyle(product, productStyle)
  )

  useEffect(() => {
    let shouldIgnore = false

    async function loadProducts() {
      try {
        setIsLoading(true)
        setErrorMessage("")
        const nextProductsPage = await getProducts({
          page,
          size: pageSize,
          q: searchQuery,
          style: productStyle,
        })

        if (!shouldIgnore) {
          setProductsPage(nextProductsPage)
        }
      } catch (error) {
        console.error("Error loading shop products", error)

        if (!shouldIgnore) {
          setErrorMessage("Products could not be loaded.")
          setProductsPage(emptyProductsPage)
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      shouldIgnore = true
    }
  }, [page, productStyle, searchQuery])

  useEffect(() => {
    let shouldIgnore = false

    async function loadStyles() {
      try {
        const styles = await getArtStyles()

        if (!shouldIgnore) {
          setArtStyles(styles)
        }
      } catch (error) {
        console.error("Error loading art styles", error)
      }
    }

    loadStyles()

    return () => {
      shouldIgnore = true
    }
  }, [])

  function changePage(nextPage: number) {
    const maxPage = Math.max(productsPage.total_pages - 1, 0)
    const clampedPage = Math.max(0, Math.min(nextPage, maxPage))
    const nextParams = new URLSearchParams(searchParams)

    if (clampedPage > 0) {
      nextParams.set("page", String(clampedPage))
    } else {
      nextParams.delete("page")
    }

    setSearchParams(nextParams)
  }

  function changeStyle(nextStyle: string) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete("page")

    if (nextStyle === "all") {
      nextParams.delete("style")
    } else {
      nextParams.set("style", nextStyle)
    }

    setSearchParams(nextParams)
  }

  function renderStyleFilter() {
    return (
      <section className="mx-auto flex max-w-7xl justify-end px-6 pt-10">
        <div className="flex w-fit items-center gap-2">
          <label htmlFor="shop-style-filter" className="text-sm font-medium">
            Style
          </label>
          <NativeSelect
            id="shop-style-filter"
            className="w-44"
            value={selectedStyle}
            onChange={(event) => changeStyle(event.target.value)}
          >
            <NativeSelectOption value="all">All styles</NativeSelectOption>
            {artStyles.map((style) => (
              <NativeSelectOption key={style.id} value={style.style}>
                {style.style}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </section>
    )
  }

  return (
    <main>
      {isLoading ? (
        <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-14">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: pageSize }).map((_, index) => (
              <div
                key={index}
                className="aspect-[3/2] min-h-72 rounded-2xl bg-muted"
              />
            ))}
          </div>
        </section>
      ) : errorMessage ? (
        <section className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-14">
          <p className="text-muted-foreground">{errorMessage}</p>
        </section>
      ) : visibleProducts.length > 0 ? (
        <>
          {renderStyleFilter()}
          <ArtworkSection
            title="Shop Arts"
            products={visibleProducts}
            showTitle={false}
            showViewAllButton={false}
          />
          {productsPage.total_pages > 1 ? (
            <Pagination className="px-6 pb-14">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={productsPage.first}
                    tabIndex={productsPage.first ? -1 : undefined}
                    className={
                      productsPage.first
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                    onClick={(event) => {
                      event.preventDefault()
                      if (!productsPage.first) {
                        changePage(productsPage.page - 1)
                      }
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 text-sm text-muted-foreground">
                    Page {productsPage.page + 1} of {productsPage.total_pages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={productsPage.last}
                    tabIndex={productsPage.last ? -1 : undefined}
                    className={
                      productsPage.last
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                    onClick={(event) => {
                      event.preventDefault()
                      if (!productsPage.last) {
                        changePage(productsPage.page + 1)
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </>
      ) : (
        <>
          {renderStyleFilter()}
          <section className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center gap-4 px-6 py-14 text-center">
            <h1 className="text-3xl font-medium">
              {hasActiveFilters
                ? "No art found for this search"
                : "No art products found"}
            </h1>
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? "Try a different search or style."
                : "Please check back soon for new artwork."}
            </p>
          </section>
        </>
      )}
    </main>
  )
}
