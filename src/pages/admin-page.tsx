import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
  ArrowDownUpIcon,
  ChevronDownIcon,
  CircleDollarSignIcon,
  DownloadIcon,
  EditIcon,
  GiftIcon,
  HomeIcon,
  ImagePlusIcon,
  MegaphoneIcon,
  PackageIcon,
  PaletteIcon,
  LayoutDashboardIcon,
  PackagePlusIcon,
  PlusIcon,
  SaveIcon,
  ShoppingBagIcon,
  SlidersHorizontalIcon,
  StoreIcon,
  TrashIcon,
  UploadIcon,
  UsersIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  createProduct,
  deleteProduct,
  getProducts,
  addProductImages,
  replaceProductImages,
  updateProduct,
  type CreateProductPayload,
  type ProductsPage,
  type UpdateProductPayload,
} from "@/services/products"
import {
  createCarouselItem,
  deleteCarouselItem,
  getAdminCarouselItems,
  updateCarouselItem,
  updateCarouselItemStatus,
  type CarouselItem,
  type SaveCarouselItemPayload,
} from "@/services/carousel"
import {
  uploadCarouselImage,
  uploadProductImages,
  uploadStyleImage,
} from "@/services/uploads"
import {
  createArtStyle,
  deleteArtStyle,
  getArtStyles,
  patchArtStyle,
  updateArtStyle,
  type ArtStyle,
  type SaveArtStylePayload,
} from "@/services/art-styles"
import { type Product } from "@/types/product"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const productDefaults = {
  title: "",
  slug: "",
  description: "",
  price: "",
  currency: "USD",
  category: "",
  style: "",
  theme: "",
  orientation: "",
  size: "",
  stockQuantity: "",
  imageUrl: "",
  thumbnailUrl: "",
  originalUrl: "",
  mainImageFile: null as File | null,
  mainImagePreviewUrl: "",
  galleryImageFiles: [] as File[],
  galleryImagePreviewUrls: [] as string[],
}

const maxProductImages = 10

type ProductForm = typeof productDefaults
type DashboardSection = "orders" | "products" | "crousel" | "artStyles"
type CarouselMode = "list" | "new" | "edit"

type CarouselImage = {
  id: number
  title: string
  imageUrl: string
  blobName: string
  description: string
  sortOrder: number
  isActive: boolean
  imageFile?: File | null
  previewUrl?: string
}

type ArtStyleImageUpload = {
  file: File | null
  previewUrl: string
}

type Order = {
  id: number
  orderNumber: string
  date: string
  customer: string
  channel: string
  total: string
  paymentStatus: "Paid"
  fulfillmentStatus: "Fulfilled" | "Unfulfilled"
  items: string
  deliveryStatus: string
  isCancelled?: boolean
}

type AdminLocationState = {
  product?: Product
}

function createEmptyProductForm(): ProductForm {
  return { ...productDefaults }
}

const orders: Order[] = [
  {
    id: 1056,
    orderNumber: "#1056",
    date: "Yesterday at 4:28 a.m.",
    customer: "Johnny Rippin",
    channel: "Online Store",
    total: "$10.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Unfulfilled",
    items: "1 item",
    deliveryStatus: "Standard",
  },
  {
    id: 1079,
    orderNumber: "#1079",
    date: "Tuesday at 11:24 p.m.",
    customer: "Rozella Hessel",
    channel: "Online Store",
    total: "$100.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Unfulfilled",
    items: "3 items",
    deliveryStatus: "Standard",
  },
  {
    id: 1083,
    orderNumber: "#1083",
    date: "Tuesday at 07:09 a.m.",
    customer: "Aly Kiehn",
    channel: "Online Store",
    total: "$0.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Unfulfilled",
    items: "0 items",
    deliveryStatus: "Cancelled",
    isCancelled: true,
  },
  {
    id: 1090,
    orderNumber: "#1090",
    date: "Monday at 04:47 a.m.",
    customer: "Nova Schultz",
    channel: "Online Store",
    total: "$195.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Unfulfilled",
    items: "4 items",
    deliveryStatus: "Standard",
  },
  {
    id: 1095,
    orderNumber: "#1095",
    date: "Monday at 04:40 a.m.",
    customer: "Carlie Spencer",
    channel: "Online Store",
    total: "$130.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Unfulfilled",
    items: "3 items",
    deliveryStatus: "Standard",
  },
  {
    id: 1096,
    orderNumber: "#1096",
    date: "Sunday at 05:00 p.m.",
    customer: "Ophelia Upton",
    channel: "Online Store",
    total: "$80.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Unfulfilled",
    items: "1 item",
    deliveryStatus: "Standard",
  },
  {
    id: 1097,
    orderNumber: "#1097",
    date: "Sunday at 01:27 p.m.",
    customer: "Abdiel Stark",
    channel: "Online Store",
    total: "$90.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Unfulfilled",
    items: "1 item",
    deliveryStatus: "Standard",
  },
  {
    id: 1044,
    orderNumber: "#1044",
    date: "Friday at 11:47 p.m.",
    customer: "Jeremy Wuckert",
    channel: "Online Store",
    total: "$115.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Unfulfilled",
    items: "2 items",
    deliveryStatus: "Standard",
  },
  {
    id: 1007,
    orderNumber: "#1007",
    date: "Friday at 01:42 a.m.",
    customer: "Marina Brakus",
    channel: "Online Store",
    total: "$1,160.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Unfulfilled",
    items: "5 items",
    deliveryStatus: "Express",
  },
  {
    id: 1053,
    orderNumber: "#1053",
    date: "Aug 6 at 8:11 p.m.",
    customer: "Cecelia Conroy",
    channel: "Online Store",
    total: "$225.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Fulfilled",
    items: "5 items",
    deliveryStatus: "Delivered",
  },
  {
    id: 1066,
    orderNumber: "#1066",
    date: "Aug 6 at 8:31 a.m.",
    customer: "Cassidy Kreiger",
    channel: "Online Store",
    total: "$195.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Fulfilled",
    items: "4 items",
    deliveryStatus: "Delivered",
  },
  {
    id: 1033,
    orderNumber: "#1033",
    date: "Aug 5 at 3:54 p.m.",
    customer: "Melany Cronin",
    channel: "Online Store",
    total: "$260.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Fulfilled",
    items: "5 items",
    deliveryStatus: "Delivered",
  },
  {
    id: 1027,
    orderNumber: "#1027",
    date: "Jul 31 at 6:46 p.m.",
    customer: "Leda Fritsch",
    channel: "Online Store",
    total: "$40.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Fulfilled",
    items: "1 item",
    deliveryStatus: "Delivered",
  },
  {
    id: 1030,
    orderNumber: "#1030",
    date: "Jul 29 at 12:58 a.m.",
    customer: "Melody Dietrich",
    channel: "Online Store",
    total: "$115.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Fulfilled",
    items: "3 items",
    deliveryStatus: "Delivered",
  },
  {
    id: 1040,
    orderNumber: "#1040",
    date: "Jul 28 at 11:41 p.m.",
    customer: "Kamren Walter",
    channel: "Online Store",
    total: "$120.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Fulfilled",
    items: "1 item",
    deliveryStatus: "Delivered",
  },
]

const productPageDefaults: ProductsPage = {
  content: [],
  page: 0,
  size: 10,
  total_elements: 0,
  total_pages: 0,
  first: true,
  last: true,
}

const badgeColors = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  green: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  purple:
    "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  red: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index)
  }

  const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5))

  return Array.from({ length: 5 }, (_, index) => start + index)
}

function getFulfillmentBadgeColor(status: Order["fulfillmentStatus"]) {
  return status === "Fulfilled" ? badgeColors.sky : badgeColors.purple
}

function createProductFormFromProduct(product: Product): ProductForm {
  return {
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: String(product.price),
    currency: product.currency,
    category: product.category,
    style: product.style,
    theme: product.theme,
    orientation: product.orientation,
    size: product.size,
    stockQuantity: String(product.stock_quantity),
    imageUrl: product.image_url,
    thumbnailUrl: product.thumbnail_url,
    originalUrl: product.original_url,
    mainImageFile: null,
    mainImagePreviewUrl: "",
    galleryImageFiles: [],
    galleryImagePreviewUrls: [],
  }
}

function revokeProductPreviewUrls(urls: string[]) {
  urls.forEach((url) => {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url)
    }
  })
}

function createProductSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readJsonField(
  source: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = source[key]

    if (typeof value === "string") {
      return value
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return String(value)
    }
  }

  return ""
}

function createProductFormFromJson(value: unknown): ProductForm {
  const source =
    isRecord(value) && isRecord(value.data) ? value.data : value

  if (!isRecord(source)) {
    throw new Error("Product JSON must be an object.")
  }

  const title = readJsonField(source, "title")
  const slug = readJsonField(source, "slug") || createProductSlug(title)

  return {
    ...createEmptyProductForm(),
    title,
    slug,
    description: readJsonField(source, "description"),
    price: readJsonField(source, "price"),
    currency: readJsonField(source, "currency") || productDefaults.currency,
    category: readJsonField(source, "category"),
    style: readJsonField(source, "style"),
    theme: readJsonField(source, "theme"),
    orientation: readJsonField(source, "orientation"),
    size: readJsonField(source, "size"),
    stockQuantity: readJsonField(source, "stockQuantity", "stock_quantity"),
    imageUrl: readJsonField(source, "imageUrl", "image_url"),
    thumbnailUrl: readJsonField(source, "thumbnailUrl", "thumbnail_url"),
    originalUrl: readJsonField(source, "originalUrl", "original_url"),
  }
}

function readJsonStringArray(
  source: Record<string, unknown>,
  key: string
): string[] {
  const value = source[key]

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function createArtStylePayloadFromJson(value: unknown): SaveArtStylePayload {
  const source =
    isRecord(value) && isRecord(value.data) ? value.data : value

  if (!isRecord(source)) {
    throw new Error("Art style JSON must be an object.")
  }

  return {
    origin: readJsonField(source, "origin"),
    style: readJsonField(source, "style"),
    description: readJsonField(source, "description"),
    tags: readJsonStringArray(source, "tags"),
    image_url: readJsonField(source, "image_url", "imageUrl"),
    blob_name: readJsonField(source, "blob_name", "blobName"),
  }
}

function createEmptyCarouselImage(sortOrder = 1): CarouselImage {
  return {
    id: Date.now(),
    title: "",
    imageUrl: "",
    blobName: "",
    description: "",
    sortOrder,
    isActive: true,
    imageFile: null,
    previewUrl: "",
  }
}

function createCarouselImageFromItem(item: CarouselItem): CarouselImage {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: item.image_url,
    blobName: item.blob_name,
    sortOrder: item.sort_order,
    isActive: item.is_active,
    imageFile: null,
    previewUrl: "",
  }
}

function createCarouselPayload(image: CarouselImage): SaveCarouselItemPayload {
  return {
    title: image.title,
    description: image.description,
    image_url: image.imageUrl,
    blob_name: image.blobName,
    sort_order: image.sortOrder,
    is_active: image.isActive,
  }
}

function AdminBreadcrumb({
  activeSection,
  isProductCreatePage,
  isProductEditPage,
  productTitle,
}: {
  activeSection: DashboardSection
  isProductCreatePage: boolean
  isProductEditPage: boolean
  productTitle?: string
}) {
  const currentPage = isProductCreatePage
    ? "New product"
    : isProductEditPage
      ? productTitle || "Edit product"
      : activeSection === "orders"
        ? "Orders"
        : activeSection === "crousel"
          ? "Crousel"
          : "Products"

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {isProductCreatePage || isProductEditPage ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : null}
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function AdminPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { idOrSlug } = useParams()
  const locationState = location.state as AdminLocationState | null
  const isOrdersPage = location.pathname === "/admin/orders"
  const isProductCreatePage = location.pathname === "/admin/products/new"
  const isProductEditPage = Boolean(idOrSlug)
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("products")
  const visibleSection: DashboardSection = isOrdersPage
    ? "orders"
    : isProductCreatePage || isProductEditPage
      ? "products"
      : activeSection
  const [products, setProducts] = useState<Product[]>([])
  const [productsPage, setProductsPage] =
    useState<ProductsPage>(productPageDefaults)
  const [productPage, setProductPage] = useState(0)
  const [productPageSize, setProductPageSize] = useState(10)
  const [productRefreshKey, setProductRefreshKey] = useState(0)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [productSearch, setProductSearch] = useState("")
  const [productCategory, setProductCategory] = useState("all")
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(
    locationState?.product ?? null
  )
  const [productForm, setProductForm] = useState<ProductForm>(
    locationState?.product
      ? createProductFormFromProduct(locationState.product)
      : createEmptyProductForm()
  )
  const [productStatus, setProductStatus] = useState("")
  const [isSavingProduct, setIsSavingProduct] = useState(false)
  const [isDeletingProducts, setIsDeletingProducts] = useState(false)
  const [orderSearch, setOrderSearch] = useState("")
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([])
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([])
  const [carouselMode, setCarouselMode] = useState<CarouselMode>("list")
  const [carouselForm, setCarouselForm] = useState<CarouselImage>(() =>
    createEmptyCarouselImage()
  )
  const [selectedCarouselIds, setSelectedCarouselIds] = useState<number[]>([])
  const [carouselStatus, setCarouselStatus] = useState("")
  const [isLoadingCarousel, setIsLoadingCarousel] = useState(true)
  const [isSavingCarousel, setIsSavingCarousel] = useState(false)
  const [isDeletingCarousel, setIsDeletingCarousel] = useState(false)
  const [isCarouselDeleteDialogOpen, setIsCarouselDeleteDialogOpen] =
    useState(false)
  const [artStyles, setArtStyles] = useState<ArtStyle[]>([])
  const [selectedArtStyleIds, setSelectedArtStyleIds] = useState<number[]>([])
  const [artStyleStatus, setArtStyleStatus] = useState("")
  const [isLoadingArtStyles, setIsLoadingArtStyles] = useState(true)
  const [isSavingArtStyle, setIsSavingArtStyle] = useState(false)
  const [isDeletingArtStyle, setIsDeletingArtStyle] = useState(false)
  const [isArtStyleDeleteDialogOpen, setIsArtStyleDeleteDialogOpen] =
    useState(false)

  useEffect(() => {
    let shouldIgnore = false

    async function loadProducts() {
      try {
        setIsLoadingProducts(true)
        const nextProductsPage = await getProducts(productPage, productPageSize)

        if (!shouldIgnore) {
          setProductsPage(nextProductsPage)
          setProducts(nextProductsPage.content)

          if (idOrSlug) {
            const routeProduct = nextProductsPage.content.find(
              (product) =>
                product.slug === idOrSlug || String(product.id) === idOrSlug
            )

            if (routeProduct) {
              setEditingProduct(routeProduct)
              setProductForm(createProductFormFromProduct(routeProduct))
            }
          }
        }
      } catch (error) {
        console.error("Error loading products", error)
      } finally {
        if (!shouldIgnore) {
          setIsLoadingProducts(false)
        }
      }
    }

    loadProducts()

    return () => {
      shouldIgnore = true
    }
  }, [idOrSlug, productPage, productPageSize, productRefreshKey])

  useEffect(() => {
    let shouldIgnore = false

    async function loadCarouselItems() {
      try {
        setIsLoadingCarousel(true)
        const items = await getAdminCarouselItems()

        if (!shouldIgnore) {
          setCarouselImages(items.map(createCarouselImageFromItem))
        }
      } catch (error) {
        console.error("Error loading carousel items", error)
        if (!shouldIgnore) {
          setCarouselStatus("Carousel images could not be loaded.")
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoadingCarousel(false)
        }
      }
    }

    loadCarouselItems()

    return () => {
      shouldIgnore = true
    }
  }, [])

  useEffect(() => {
    let shouldIgnore = false

    async function loadArtStyles() {
      try {
        setIsLoadingArtStyles(true)
        const items = await getArtStyles()

        if (!shouldIgnore) {
          setArtStyles(items)
        }
      } catch (error) {
        console.error("Error loading art styles", error)
        if (!shouldIgnore) {
          setArtStyleStatus("Art styles could not be loaded.")
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoadingArtStyles(false)
        }
      }
    }

    loadArtStyles()

    return () => {
      shouldIgnore = true
    }
  }, [])

  const productCategories = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.category).filter(Boolean))
      ),
    [products]
  )

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        productCategory === "all" || product.category === productCategory
      const matchesSearch =
        query.length === 0 ||
        [
          product.title,
          product.slug,
          product.category,
          product.theme,
          product.style,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)

      return matchesCategory && matchesSearch
    })
  }, [productCategory, productSearch, products])

  const filteredOrders = useMemo(() => {
    const query = orderSearch.trim().toLowerCase()

    if (!query) {
      return orders
    }

    return orders.filter((order) =>
      [
        order.orderNumber,
        order.date,
        order.customer,
        order.channel,
        order.total,
        order.paymentStatus,
        order.fulfillmentStatus,
        order.items,
        order.deliveryStatus,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    )
  }, [orderSearch])

  function updateProductField(field: keyof ProductForm, value: string) {
    setProductForm((current) => ({ ...current, [field]: value }))
  }

  function updateProductMainImageFile(file: File | null) {
    setProductForm((current) => {
      revokeProductPreviewUrls([current.mainImagePreviewUrl])
      const nextPreviewUrl = file ? URL.createObjectURL(file) : ""

      return {
        ...current,
        mainImageFile: file,
        mainImagePreviewUrl: nextPreviewUrl,
        imageUrl: file
          ? nextPreviewUrl
          : current.mainImagePreviewUrl
            ? ""
            : current.imageUrl,
        thumbnailUrl: "",
        originalUrl: "",
      }
    })
  }

  function updateProductGalleryImageFiles(files: File[]) {
    setProductForm((current) => {
      revokeProductPreviewUrls(current.galleryImagePreviewUrls)
      const nextFiles = files.slice(0, maxProductImages - 1)
      const nextPreviewUrls = nextFiles.map((file) => URL.createObjectURL(file))

      return {
        ...current,
        galleryImageFiles: nextFiles,
        galleryImagePreviewUrls: nextPreviewUrls,
      }
    })
  }

  function changeProductCategory(value: string) {
    setSelectedProductIds([])
    setProductCategory(value)
  }

  function changeProductPage(page: number) {
    setSelectedProductIds([])
    setProductPage(page)
  }

  function changeProductPageSize(size: number) {
    setSelectedProductIds([])
    setProductPage(0)
    setProductPageSize(size)
  }

  function changeProductSearch(value: string) {
    setSelectedProductIds([])
    setProductSearch(value)
  }

  function openCreateProductForm() {
    setEditingProduct(null)
    setProductForm(createEmptyProductForm())
    setProductStatus("")
    navigate("/admin/products/new", { state: null })
  }

  function openEditProductForm() {
    const product = products.find((item) => item.id === selectedProductIds[0])

    if (!product) {
      return
    }

    setEditingProduct(product)
    setProductForm(createProductFormFromProduct(product))
    setProductStatus("")
    navigate(`/admin/products/${product.slug || product.id}/edit`, {
      state: { product },
    })
  }

  function closeProductPage() {
    setSelectedProductIds([])
    setEditingProduct(null)
    setProductForm(createEmptyProductForm())
    navigate("/admin")
  }

  function closeEditPage() {
    closeProductPage()
  }

  function updateCarouselFormField(
    field: keyof Pick<
      CarouselImage,
      "title" | "description" | "imageUrl" | "blobName" | "sortOrder"
    >,
    value: string
  ) {
    setCarouselForm((current) => ({
      ...current,
      [field]: field === "sortOrder" ? Number(value) : value,
    }))
  }

  function openCreateCarouselForm() {
    setCarouselForm(createEmptyCarouselImage(carouselImages.length + 1))
    setSelectedCarouselIds([])
    setCarouselStatus("")
    setCarouselMode("new")
  }

  function openEditCarouselForm() {
    const image = carouselImages.find(
      (item) => item.id === selectedCarouselIds[0]
    )

    if (!image) {
      return
    }

    setCarouselForm({ ...image, imageFile: null, previewUrl: "" })
    setCarouselStatus("")
    setCarouselMode("edit")
  }

  function closeCarouselForm() {
    if (carouselForm.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(carouselForm.previewUrl)
    }

    setCarouselForm(createEmptyCarouselImage(carouselImages.length + 1))
    setCarouselMode("list")
  }

  function createProductPayload(form: ProductForm): CreateProductPayload {
    return {
      title: form.title,
      slug: form.slug,
      description: form.description,
      price: Number(form.price),
      currency: form.currency,
      category: form.category,
      style: form.style,
      theme: form.theme,
      orientation: form.orientation,
      size: form.size,
      image_url: form.imageUrl,
      thumbnail_url: form.thumbnailUrl,
      original_url: form.originalUrl,
      stock_quantity: Number(form.stockQuantity),
      is_active: true,
    }
  }

  function createUpdateProductPayload(form: ProductForm): UpdateProductPayload {
    return {
      title: form.title,
      slug: form.slug,
      description: form.description,
      price: Number(form.price),
      currency: form.currency,
      category: form.category,
      style: form.style,
      theme: form.theme,
      orientation: form.orientation,
      size: form.size,
      image_url: form.imageUrl,
      thumbnail_url: form.thumbnailUrl,
      original_url: form.originalUrl,
      stock_quantity: Number(form.stockQuantity),
    }
  }

  async function uploadProductFormImages(form: ProductForm) {
    if (!form.mainImageFile) {
      return {
        form,
        imagePayload: null,
      }
    }

    const uploads = await uploadProductImages(
      [form.mainImageFile, ...form.galleryImageFiles].slice(
        0,
        maxProductImages
      )
    )
    const primaryUpload = uploads[0]
    const galleryUploads = uploads.slice(1)

    revokeProductPreviewUrls([
      form.mainImagePreviewUrl,
      ...form.galleryImagePreviewUrls,
    ])

    return primaryUpload
      ? {
          form: {
            ...form,
            mainImageFile: null,
            mainImagePreviewUrl: "",
            galleryImageFiles: [],
            galleryImagePreviewUrls: [],
            imageUrl: primaryUpload.image_url,
            thumbnailUrl: primaryUpload.image_url,
            originalUrl: primaryUpload.image_url,
          },
          imagePayload: {
            main_image: {
              blob_name: primaryUpload.blob_name,
              alt_text: form.title || "Main product image",
            },
            gallery_images: galleryUploads.map((upload, index) => ({
              blob_name: upload.blob_name,
              alt_text: `${form.title || "Gallery image"} ${index + 1}`,
            })),
          },
        }
      : {
          form,
          imagePayload: null,
        }
  }

  async function createNewProductFromForm(submittedForm: ProductForm) {
    if (
      submittedForm.galleryImageFiles.length > 0 &&
      !submittedForm.mainImageFile
    ) {
      throw new Error("Select a main image when adding gallery images.")
    }

    const productImageUpload = await uploadProductFormImages(submittedForm)
    const productFormToSave = productImageUpload.form
    const savedProduct = await createProduct(createProductPayload(productFormToSave))
    const createdProduct =
      productImageUpload.imagePayload
        ? await addProductImages(savedProduct.id, productImageUpload.imagePayload)
        : savedProduct

    setProducts((current) =>
      productPage === 0
        ? [createdProduct, ...current].slice(0, productPageSize)
        : current
    )
    setProductsPage((current) => ({
      ...current,
      total_elements: current.total_elements + 1,
      total_pages: Math.max(
        1,
        Math.ceil((current.total_elements + 1) / current.size)
      ),
    }))
    setProductPage(0)
    setProductRefreshKey((current) => current + 1)

    return createdProduct
  }

  async function handleProductSubmit(
    event: FormEvent<HTMLFormElement>,
    submittedForm = productForm
  ) {
    event.preventDefault()

    try {
      setIsSavingProduct(true)
      setProductStatus("")

      if (
        submittedForm.galleryImageFiles.length > 0 &&
        !submittedForm.mainImageFile
      ) {
        setProductStatus(
          "Select a main image when adding or replacing gallery images."
        )
        return
      }

      if (editingProduct) {
        const productImageUpload = await uploadProductFormImages(submittedForm)
        const productFormToSave = productImageUpload.form
        const savedProduct = await updateProduct(
          editingProduct.slug || editingProduct.id,
          createUpdateProductPayload(productFormToSave)
        )
        const updatedProduct =
          productImageUpload.imagePayload
            ? await replaceProductImages(savedProduct.id, productImageUpload.imagePayload)
            : savedProduct

        setProducts((current) =>
          current.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        )
        setSelectedProductIds([])
        setEditingProduct(null)
        setProductForm(createEmptyProductForm())
        setProductStatus("Product updated successfully.")
        navigate("/admin")
        return
      }

      await createNewProductFromForm(submittedForm)
      setProductForm(createEmptyProductForm())
      setProductStatus("Product added successfully.")
      navigate("/admin")
    } catch (error) {
      console.error("Error saving product", error)
      setProductStatus(
        editingProduct
          ? "Product could not be updated."
          : "Product could not be added."
      )
    } finally {
      setIsSavingProduct(false)
    }
  }

  async function handleJsonProductCreate(submittedForm: ProductForm) {
    try {
      setIsSavingProduct(true)
      setProductStatus("")
      await createNewProductFromForm(submittedForm)
      setProductForm(createEmptyProductForm())
      setProductStatus("Product added successfully.")
      navigate("/admin")
    } catch (error) {
      console.error("Error saving product from JSON", error)
      setProductStatus("Product could not be added.")
      throw error
    } finally {
      setIsSavingProduct(false)
    }
  }

  async function handleDeleteProducts() {
    const productsToDelete = products.filter((product) =>
      selectedProductIds.includes(product.id)
    )

    try {
      setIsDeletingProducts(true)
      setProductStatus("")
      await Promise.all(
        productsToDelete.map((product) =>
          deleteProduct(product.slug || product.id)
        )
      )
      setSelectedProductIds([])
      setIsDeleteDialogOpen(false)
      setProductStatus(
        productsToDelete.length === 1
          ? "Product deleted successfully."
          : "Products deleted successfully."
      )
      setProductRefreshKey((current) => current + 1)
    } catch (error) {
      console.error("Error deleting products", error)
      setProductStatus("Product could not be deleted.")
    } finally {
      setIsDeletingProducts(false)
    }
  }

  function updateCarouselFile(file: File | null) {
    setCarouselForm((current) => {
      if (current.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(current.previewUrl)
      }

      if (!file) {
        return {
          ...current,
          imageFile: null,
          previewUrl: "",
          imageUrl: "",
          blobName: "",
        }
      }

      return {
        ...current,
        imageFile: file,
        previewUrl: URL.createObjectURL(file),
      }
    })
  }

  async function handleCarouselSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSavingCarousel(true)
      setCarouselStatus("")

      let nextImage = carouselForm

      if (carouselForm.imageFile) {
        const upload = await uploadCarouselImage(carouselForm.imageFile)

        if (carouselForm.previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(carouselForm.previewUrl)
        }

        nextImage = {
          ...carouselForm,
          imageFile: null,
          previewUrl: "",
          imageUrl: upload.image_url,
          blobName: upload.blob_name,
        }
      }

      const savedImage =
        carouselMode === "edit"
          ? await updateCarouselItem(
              nextImage.id,
              createCarouselPayload(nextImage)
            )
          : await createCarouselItem(createCarouselPayload(nextImage))
      const nextCarouselImage = createCarouselImageFromItem(savedImage)

      setCarouselImages((current) =>
        carouselMode === "edit"
          ? current.map((image) =>
              image.id === nextCarouselImage.id ? nextCarouselImage : image
            )
          : [...current, nextCarouselImage].sort(
              (first, second) => first.sortOrder - second.sortOrder
            )
      )
      setSelectedCarouselIds([])
      setCarouselForm(createEmptyCarouselImage(carouselImages.length + 2))
      setCarouselMode("list")
      setCarouselStatus(
        carouselMode === "edit"
          ? "Carousel image updated successfully."
          : "Carousel image added successfully."
      )
    } catch (error) {
      console.error("Error uploading carousel images", error)
      setCarouselStatus(
        carouselMode === "edit"
          ? "Carousel image could not be updated."
          : "Carousel image could not be added."
      )
    } finally {
      setIsSavingCarousel(false)
    }
  }

  async function handleDeleteCarouselItems() {
    try {
      setIsDeletingCarousel(true)
      setCarouselStatus("")
      await Promise.all(selectedCarouselIds.map((id) => deleteCarouselItem(id)))
      setCarouselImages((current) =>
        current.filter((image) => !selectedCarouselIds.includes(image.id))
      )
      setSelectedCarouselIds([])
      setIsCarouselDeleteDialogOpen(false)
      setCarouselStatus("Carousel image deleted successfully.")
    } catch (error) {
      console.error("Error deleting carousel images", error)
      setCarouselStatus("Carousel image could not be deleted.")
    } finally {
      setIsDeletingCarousel(false)
    }
  }

  async function handleCarouselStatusChange(isActive: boolean) {
    try {
      setIsSavingCarousel(true)
      setCarouselStatus("")
      const updatedItems = await Promise.all(
        selectedCarouselIds.map((id) => updateCarouselItemStatus(id, isActive))
      )
      const updatedImages = updatedItems.map(createCarouselImageFromItem)

      setCarouselImages((current) =>
        current.map((image) => {
          const updatedImage = updatedImages.find(
            (item) => item.id === image.id
          )
          return updatedImage ?? image
        })
      )
      setSelectedCarouselIds([])
      setCarouselStatus(
        isActive
          ? "Carousel image activated successfully."
          : "Carousel image deactivated successfully."
      )
    } catch (error) {
      console.error("Error updating carousel status", error)
      setCarouselStatus("Carousel image status could not be updated.")
    } finally {
      setIsSavingCarousel(false)
    }
  }

  async function createArtStyleFromJson(
    payload: SaveArtStylePayload,
    imageFile: File | null
  ) {
    try {
      setIsSavingArtStyle(true)
      setArtStyleStatus("")

      const upload = imageFile ? await uploadStyleImage(imageFile) : null
      const savedStyle = await createArtStyle({
        ...payload,
        image_url: upload?.image_url || payload.image_url,
        blob_name: upload?.blob_name || payload.blob_name,
      })

      setArtStyles((current) => [savedStyle, ...current])
      setSelectedArtStyleIds([])
      setArtStyleStatus("Art style created successfully.")
    } catch (error) {
      console.error("Error creating art style", error)
      setArtStyleStatus("Art style could not be created.")
      throw error
    } finally {
      setIsSavingArtStyle(false)
    }
  }

  async function updateArtStyleFromJson(
    id: number,
    payload: SaveArtStylePayload,
    imageFile: File | null
  ) {
    try {
      setIsSavingArtStyle(true)
      setArtStyleStatus("")

      const upload = imageFile ? await uploadStyleImage(imageFile) : null
      const savedStyle = await updateArtStyle(id, {
        ...payload,
        image_url: upload?.image_url || payload.image_url,
        blob_name: upload?.blob_name || payload.blob_name,
      })

      setArtStyles((current) =>
        current.map((style) => (style.id === savedStyle.id ? savedStyle : style))
      )
      setSelectedArtStyleIds([])
      setArtStyleStatus("Art style updated successfully.")
    } catch (error) {
      console.error("Error updating art style", error)
      setArtStyleStatus("Art style could not be updated.")
      throw error
    } finally {
      setIsSavingArtStyle(false)
    }
  }

  async function patchSelectedArtStyle(
    payload: Partial<SaveArtStylePayload>,
    imageFile: File | null
  ) {
    const styleId = selectedArtStyleIds[0]

    if (!styleId) {
      return
    }

    try {
      setIsSavingArtStyle(true)
      setArtStyleStatus("")
      const upload = imageFile ? await uploadStyleImage(imageFile) : null
      const savedStyle = await patchArtStyle(styleId, {
        ...payload,
        ...(upload
          ? {
              image_url: upload.image_url,
              blob_name: upload.blob_name,
            }
          : {}),
      })

      setArtStyles((current) =>
        current.map((style) => (style.id === savedStyle.id ? savedStyle : style))
      )
      setSelectedArtStyleIds([])
      setArtStyleStatus("Art style patched successfully.")
    } catch (error) {
      console.error("Error patching art style", error)
      setArtStyleStatus("Art style could not be patched.")
    } finally {
      setIsSavingArtStyle(false)
    }
  }

  async function handleDeleteArtStyles() {
    try {
      setIsDeletingArtStyle(true)
      setArtStyleStatus("")
      await Promise.all(selectedArtStyleIds.map((id) => deleteArtStyle(id)))
      setArtStyles((current) =>
        current.filter((style) => !selectedArtStyleIds.includes(style.id))
      )
      setSelectedArtStyleIds([])
      setIsArtStyleDeleteDialogOpen(false)
      setArtStyleStatus("Art style deleted successfully.")
    } catch (error) {
      console.error("Error deleting art styles", error)
      setArtStyleStatus("Art style could not be deleted.")
    } finally {
      setIsDeletingArtStyle(false)
    }
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Admin">
                  <LayoutDashboardIcon aria-hidden="true" />
                  <span>Admin</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Store</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Home">
                      <HomeIcon aria-hidden="true" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={visibleSection === "orders"}
                      onClick={() => {
                        setActiveSection("orders")
                        setSelectedOrderIds([])
                        navigate("/admin/orders")
                      }}
                      tooltip="Orders"
                    >
                      <ShoppingBagIcon aria-hidden="true" />
                      <span>Orders</span>
                      <Badge variant="secondary" className="ml-auto">
                        4
                      </Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={visibleSection === "products"}
                      onClick={() => {
                        setActiveSection("products")
                        setSelectedOrderIds([])
                        navigate("/admin")
                      }}
                      tooltip="Products"
                    >
                      <PackageIcon aria-hidden="true" />
                      <span>Products</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={visibleSection === "artStyles"}
                      onClick={() => {
                        setActiveSection("artStyles")
                        setSelectedArtStyleIds([])
                        navigate("/admin")
                      }}
                      tooltip="Art Styles"
                    >
                      <PaletteIcon aria-hidden="true" />
                      <span>Art Styles</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={visibleSection === "crousel"}
                      onClick={() => {
                        setActiveSection("crousel")
                        setSelectedOrderIds([])
                        navigate("/admin")
                      }}
                      tooltip="Crousel"
                    >
                      <ImagePlusIcon aria-hidden="true" />
                      <span>Crousel</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Customers">
                      <UsersIcon aria-hidden="true" />
                      <span>Customers</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Finances">
                      <CircleDollarSignIcon aria-hidden="true" />
                      <span>Finances</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Marketing">
                      <MegaphoneIcon aria-hidden="true" />
                      <span>Marketing</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Discounts">
                      <GiftIcon aria-hidden="true" />
                      <span>Discounts</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Sales channels</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {["Online Store", "Point of Sale", "Shop"].map((item) => (
                    <SidebarMenuItem key={item}>
                      <SidebarMenuButton tooltip={item}>
                        <StoreIcon aria-hidden="true" />
                        <span>{item}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <SaveIcon aria-hidden="true" />
                  <span>Drafts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="min-w-0 bg-muted/40">
          <div className="flex min-w-0 flex-1 flex-col gap-6 p-6">
            <AdminBreadcrumb
              activeSection={visibleSection}
              isProductCreatePage={isProductCreatePage}
              isProductEditPage={isProductEditPage}
              productTitle={editingProduct?.title}
            />

            {isOrdersPage ? (
              <OrdersPanel
                orders={filteredOrders}
                searchQuery={orderSearch}
                selectedOrderIds={selectedOrderIds}
                onSearchChange={(value) => {
                  setSelectedOrderIds([])
                  setOrderSearch(value)
                }}
                onSelectedOrderIdsChange={setSelectedOrderIds}
              />
            ) : isProductCreatePage ? (
              <ProductCreatePanel
                key={location.key}
                status={productStatus}
                isSaving={isSavingProduct}
                onCancel={closeProductPage}
                onCreateWithJson={handleJsonProductCreate}
                onSubmit={handleProductSubmit}
              />
            ) : isProductEditPage ? (
              <ProductEditPanel
                form={productForm}
                product={editingProduct}
                status={productStatus}
                isSaving={isSavingProduct}
                onCancel={closeEditPage}
                onFieldChange={updateProductField}
                onGalleryImageFilesChange={updateProductGalleryImageFiles}
                onMainImageFileChange={updateProductMainImageFile}
                onSubmit={handleProductSubmit}
              />
            ) : visibleSection === "products" ? (
              <ProductPanel
                products={filteredProducts}
                page={productsPage}
                categories={productCategories}
                categoryFilter={productCategory}
                isDeleting={isDeletingProducts}
                isDeleteDialogOpen={isDeleteDialogOpen}
                isLoadingProducts={isLoadingProducts}
                isSavingProduct={isSavingProduct}
                selectedProductIds={selectedProductIds}
                searchQuery={productSearch}
                totalProducts={productsPage.total_elements}
                onCategoryFilterChange={changeProductCategory}
                onDeleteSelected={handleDeleteProducts}
                onDeleteDialogOpenChange={setIsDeleteDialogOpen}
                onEditSelected={openEditProductForm}
                onPageChange={changeProductPage}
                onPageSizeChange={changeProductPageSize}
                onSearchChange={changeProductSearch}
                onSelectedProductIdsChange={setSelectedProductIds}
                onCreateWithJson={handleJsonProductCreate}
                onCreateProduct={openCreateProductForm}
              />
            ) : visibleSection === "crousel" ? (
              <CrouselPanel
                images={carouselImages}
                form={carouselForm}
                mode={carouselMode}
                isDeleteDialogOpen={isCarouselDeleteDialogOpen}
                isDeleting={isDeletingCarousel}
                isLoading={isLoadingCarousel}
                isSaving={isSavingCarousel}
                selectedImageIds={selectedCarouselIds}
                status={carouselStatus}
                onActivateSelected={() => handleCarouselStatusChange(true)}
                onCancelForm={closeCarouselForm}
                onCreateImage={openCreateCarouselForm}
                onDeactivateSelected={() => handleCarouselStatusChange(false)}
                onDeleteDialogOpenChange={setIsCarouselDeleteDialogOpen}
                onDeleteSelected={handleDeleteCarouselItems}
                onEditSelected={openEditCarouselForm}
                onImageFileChange={updateCarouselFile}
                onImageChange={updateCarouselFormField}
                onSelectedImageIdsChange={setSelectedCarouselIds}
                onSubmit={handleCarouselSubmit}
              />
            ) : (
              <ArtStylesPanel
                styles={artStyles}
                isDeleteDialogOpen={isArtStyleDeleteDialogOpen}
                isDeleting={isDeletingArtStyle}
                isLoading={isLoadingArtStyles}
                isSaving={isSavingArtStyle}
                selectedStyleIds={selectedArtStyleIds}
                status={artStyleStatus}
                onCreateStyle={createArtStyleFromJson}
                onDeleteDialogOpenChange={setIsArtStyleDeleteDialogOpen}
                onDeleteSelected={handleDeleteArtStyles}
                onPatchSelected={patchSelectedArtStyle}
                onSelectedStyleIdsChange={setSelectedArtStyleIds}
                onUpdateStyle={updateArtStyleFromJson}
              />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

function OrdersPanel({
  orders,
  searchQuery,
  selectedOrderIds,
  onSearchChange,
  onSelectedOrderIdsChange,
}: {
  orders: Order[]
  searchQuery: string
  selectedOrderIds: number[]
  onSearchChange: (value: string) => void
  onSelectedOrderIdsChange: (ids: number[]) => void
}) {
  const selectedCount = selectedOrderIds.length
  const visibleOrderIds = orders.map((order) => order.id)
  const isAllVisibleSelected =
    visibleOrderIds.length > 0 &&
    visibleOrderIds.every((id) => selectedOrderIds.includes(id))

  function toggleOrderSelection(orderId: number, checked: boolean) {
    onSelectedOrderIdsChange(
      checked
        ? [...selectedOrderIds, orderId]
        : selectedOrderIds.filter((id) => id !== orderId)
    )
  }

  function toggleVisibleSelection(checked: boolean) {
    onSelectedOrderIdsChange(checked ? visibleOrderIds : [])
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-3xl font-semibold tracking-normal">Orders</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            <DownloadIcon data-icon="inline-start" aria-hidden="true" />
            Export
          </Button>
          <Button variant="secondary">
            More actions
            <ChevronDownIcon data-icon="inline-end" aria-hidden="true" />
          </Button>
          <Button>Create order</Button>
        </div>
      </div>

      <Card className="min-w-0 overflow-hidden">
        <CardContent className="flex min-w-0 flex-col p-0">
          <div className="flex min-w-0 flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
            {selectedCount > 0 ? (
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={badgeColors.blue}>
                  {selectedCount} selected
                </Badge>
                <Button variant="outline">Fulfill orders</Button>
                <Button variant="outline">Mark as paid</Button>
                <Button
                  variant="ghost"
                  onClick={() => onSelectedOrderIdsChange([])}
                >
                  Clear selection
                </Button>
              </div>
            ) : (
              <div className="flex min-w-0 flex-wrap gap-2">
                {["All", "Unfulfilled", "Unpaid", "Open", "Archived"].map(
                  (label) => (
                    <Button
                      key={label}
                      variant={label === "All" ? "secondary" : "ghost"}
                    >
                      {label}
                    </Button>
                  )
                )}
                <Button variant="ghost" size="icon-sm">
                  <PlusIcon />
                  <span className="sr-only">Add view</span>
                </Button>
              </div>
            )}

            {selectedCount === 0 ? (
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  aria-label="Search orders"
                  className="sm:w-64"
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search orders"
                  value={searchQuery}
                />
                <Button variant="outline" size="icon-sm">
                  <SlidersHorizontalIcon />
                  <span className="sr-only">Filter orders</span>
                </Button>
                <Button variant="outline" size="icon-sm">
                  <ArrowDownUpIcon />
                  <span className="sr-only">Sort orders</span>
                </Button>
              </div>
            ) : null}
          </div>

          <div className="min-w-0">
            <Table className="min-w-[1120px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      aria-label="Select all orders"
                      checked={isAllVisibleSelected}
                      onCheckedChange={toggleVisibleSelection}
                    />
                  </TableHead>
                  <TableHead className="min-w-28">Order</TableHead>
                  <TableHead className="min-w-56">
                    <div className="flex items-center gap-1">
                      Date
                      <ChevronDownIcon aria-hidden="true" />
                    </div>
                  </TableHead>
                  <TableHead className="min-w-56">Customer</TableHead>
                  <TableHead className="min-w-36">Channel</TableHead>
                  <TableHead className="min-w-28 text-right">Total</TableHead>
                  <TableHead className="min-w-44">Payment status</TableHead>
                  <TableHead className="min-w-52">Fulfillment status</TableHead>
                  <TableHead className="min-w-28">Items</TableHead>
                  <TableHead className="min-w-40">Delivery status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow
                      key={order.id}
                      data-state={
                        selectedOrderIds.includes(order.id)
                          ? "selected"
                          : undefined
                      }
                      className={
                        order.isCancelled ? "text-muted-foreground" : ""
                      }
                    >
                      <TableCell>
                        <Checkbox
                          aria-label={`Select ${order.orderNumber}`}
                          checked={selectedOrderIds.includes(order.id)}
                          onCheckedChange={(checked) =>
                            toggleOrderSelection(order.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            order.isCancelled
                              ? "font-medium line-through"
                              : "font-medium"
                          }
                        >
                          {order.orderNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={order.isCancelled ? "line-through" : ""}
                        >
                          {order.date}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={order.isCancelled ? "line-through" : ""}
                        >
                          {order.customer}
                        </span>
                      </TableCell>
                      <TableCell>{order.channel}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={order.isCancelled ? "line-through" : ""}
                        >
                          {order.total}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${badgeColors.green} gap-1.5`}>
                          <span className="size-2 rounded-full bg-muted-foreground" />
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getFulfillmentBadgeColor(order.fulfillmentStatus)} gap-1.5`}
                        >
                          <span className="size-2 rounded-sm border border-current" />
                          {order.fulfillmentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={order.isCancelled ? "line-through" : ""}
                        >
                          {order.items}
                        </span>
                      </TableCell>
                      <TableCell>{order.deliveryStatus}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 border-t p-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {orders.length} of {orders.length} orders
            </p>
            <div className="h-2 w-full max-w-xl rounded-full bg-border md:w-1/2">
              <div className="h-2 w-3/5 rounded-full bg-muted-foreground/30" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProductPanel({
  products,
  page,
  categories,
  categoryFilter,
  isDeleting,
  isDeleteDialogOpen,
  isLoadingProducts,
  isSavingProduct,
  searchQuery,
  selectedProductIds,
  totalProducts,
  onCategoryFilterChange,
  onDeleteSelected,
  onDeleteDialogOpenChange,
  onEditSelected,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSelectedProductIdsChange,
  onCreateWithJson,
  onCreateProduct,
}: {
  products: Product[]
  page: ProductsPage
  categories: string[]
  categoryFilter: string
  isDeleting: boolean
  isDeleteDialogOpen: boolean
  isLoadingProducts: boolean
  isSavingProduct: boolean
  searchQuery: string
  selectedProductIds: number[]
  totalProducts: number
  onCategoryFilterChange: (value: string) => void
  onDeleteSelected: () => void
  onDeleteDialogOpenChange: (open: boolean) => void
  onEditSelected: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onSearchChange: (value: string) => void
  onSelectedProductIdsChange: (ids: number[]) => void
  onCreateWithJson: (form: ProductForm) => Promise<void>
  onCreateProduct: () => void
}) {
  const pageNumbers = getVisiblePages(page.page, page.total_pages)
  const firstItem = page.total_elements === 0 ? 0 : page.page * page.size + 1
  const lastItem = Math.min((page.page + 1) * page.size, page.total_elements)
  const hasPreviousPage = !page.first && page.total_pages > 1
  const hasNextPage = !page.last && page.total_pages > 1
  const selectedCount = selectedProductIds.length
  const visibleProductIds = products.map((product) => product.id)
  const isAllVisibleSelected =
    visibleProductIds.length > 0 &&
    visibleProductIds.every((id) => selectedProductIds.includes(id))

  function toggleProductSelection(productId: number, checked: boolean) {
    onSelectedProductIdsChange(
      checked
        ? [...selectedProductIds, productId]
        : selectedProductIds.filter((id) => id !== productId)
    )
  }

  function toggleVisibleSelection(checked: boolean) {
    onSelectedProductIdsChange(checked ? visibleProductIds : [])
  }

  const activeProducts = products.filter((product) => product.is_active).length
  const draftProducts = products.length - activeProducts

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-3xl font-semibold tracking-normal">Products</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            <DownloadIcon data-icon="inline-start" aria-hidden="true" />
            Export
          </Button>
          <Button variant="secondary">
            <UploadIcon data-icon="inline-start" aria-hidden="true" />
            Import
          </Button>
          <ProductJsonCreateDialog
            isSaving={isSavingProduct}
            onCreate={onCreateWithJson}
          />
          <Button onClick={onCreateProduct}>Add product</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col p-0">
          <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
            {selectedCount > 0 ? (
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={badgeColors.blue}>
                  {selectedCount} selected
                </Badge>
                <Button
                  variant="outline"
                  disabled={selectedCount !== 1}
                  onClick={onEditSelected}
                >
                  <EditIcon data-icon="inline-start" aria-hidden="true" />
                  Edit
                </Button>
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={onDeleteDialogOpenChange}
                >
                  <Button
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={() => onDeleteDialogOpenChange(true)}
                  >
                    <TrashIcon data-icon="inline-start" aria-hidden="true" />
                    Delete
                  </Button>
                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogMedia>
                        <TrashIcon aria-hidden="true" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Delete products?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {selectedCount} selected{" "}
                        {selectedCount === 1 ? "product" : "products"}. This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={onDeleteSelected}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  variant="ghost"
                  onClick={() => onSelectedProductIdsChange([])}
                >
                  Clear selection
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {[
                  ["All", totalProducts],
                  ["Active", activeProducts],
                  ["Draft", draftProducts],
                ].map(([label, count]) => (
                  <Button
                    key={label}
                    variant={label === "All" ? "secondary" : "ghost"}
                  >
                    {label}
                    {label === "All" ? (
                      <span className="text-muted-foreground">{count}</span>
                    ) : null}
                  </Button>
                ))}
              </div>
            )}

            {selectedCount === 0 ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <NativeSelect
                  aria-label="Filter products by category"
                  value={categoryFilter}
                  onChange={(event) =>
                    onCategoryFilterChange(event.target.value)
                  }
                >
                  <NativeSelectOption value="all">
                    All categories
                  </NativeSelectOption>
                  {categories.map((category) => (
                    <NativeSelectOption key={category} value={category}>
                      {category}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <Input
                  aria-label="Search products"
                  className="sm:w-64"
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search products"
                  value={searchQuery}
                />
                <Button variant="outline" size="icon-sm">
                  <SlidersHorizontalIcon />
                  <span className="sr-only">Filter</span>
                </Button>
                <Button variant="outline" size="icon-sm">
                  <ArrowDownUpIcon />
                  <span className="sr-only">Sort</span>
                </Button>
              </div>
            ) : null}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    aria-label="Select all products on this page"
                    checked={isAllVisibleSelected}
                    onCheckedChange={toggleVisibleSelection}
                  />
                </TableHead>
                <TableHead className="min-w-72">
                  <div className="flex items-center gap-1">
                    Product
                    <ChevronDownIcon aria-hidden="true" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead className="text-right">Sales channels</TableHead>
                <TableHead className="text-right">Markets</TableHead>
                <TableHead className="text-right">B2B catalogs</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingProducts ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    data-state={
                      selectedProductIds.includes(product.id)
                        ? "selected"
                        : undefined
                    }
                  >
                    <TableCell>
                      <Checkbox
                        aria-label={`Select ${product.title}`}
                        checked={selectedProductIds.includes(product.id)}
                        onCheckedChange={(checked) =>
                          toggleProductSelection(product.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail_url || product.image_url}
                          alt={product.title}
                          className="size-12 rounded-md border object-cover"
                        />
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="font-medium">{product.title}</span>
                          <span className="max-w-64 truncate text-xs text-muted-foreground">
                            {product.slug}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          product.is_active
                            ? badgeColors.green
                            : badgeColors.blue
                        }
                      >
                        {product.is_active ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.stock_quantity > 0
                        ? `${product.stock_quantity.toLocaleString()} in stock`
                        : "Inventory not tracked"}
                    </TableCell>
                    <TableCell className="text-right">4</TableCell>
                    <TableCell className="text-right">3</TableCell>
                    <TableCell className="text-right">0</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.style}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-4 border-t p-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {firstItem}-{lastItem} of {page.total_elements}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <NativeSelect
                aria-label="Rows per page"
                value={String(page.size)}
                onChange={(event) =>
                  onPageSizeChange(Number(event.target.value))
                }
              >
                {[5, 10, 20, 50].map((size) => (
                  <NativeSelectOption key={size} value={String(size)}>
                    {size} / page
                  </NativeSelectOption>
                ))}
              </NativeSelect>

              <Pagination className="mx-0 w-auto justify-start">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={hasPreviousPage ? "#" : undefined}
                      aria-disabled={!hasPreviousPage}
                      tabIndex={hasPreviousPage ? undefined : -1}
                      className={
                        hasPreviousPage
                          ? undefined
                          : "pointer-events-none opacity-50"
                      }
                      onClick={(event) => {
                        event.preventDefault()
                        if (hasPreviousPage) {
                          onPageChange(page.page - 1)
                        }
                      }}
                    />
                  </PaginationItem>
                  {pageNumbers.map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === page.page}
                        onClick={(event) => {
                          event.preventDefault()
                          onPageChange(pageNumber)
                        }}
                      >
                        {pageNumber + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href={hasNextPage ? "#" : undefined}
                      aria-disabled={!hasNextPage}
                      tabIndex={hasNextPage ? undefined : -1}
                      className={
                        hasNextPage
                          ? undefined
                          : "pointer-events-none opacity-50"
                      }
                      onClick={(event) => {
                        event.preventDefault()
                        if (hasNextPage) {
                          onPageChange(page.page + 1)
                        }
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProductJsonCreateDialog({
  isSaving,
  onCreate,
}: {
  isSaving: boolean
  onCreate: (form: ProductForm) => Promise<void>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [jsonText, setJsonText] = useState("")
  const [form, setForm] = useState<ProductForm>(() => createEmptyProductForm())
  const [status, setStatus] = useState("")

  function resetDialog() {
    revokeProductPreviewUrls([
      form.mainImagePreviewUrl,
      ...form.galleryImagePreviewUrls,
    ])
    setJsonText("")
    setForm(createEmptyProductForm())
    setStatus("")
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open)

    if (!open) {
      resetDialog()
    }
  }

  function updateMainImageFile(file: File | null) {
    setForm((current) => {
      revokeProductPreviewUrls([current.mainImagePreviewUrl])
      const nextPreviewUrl = file ? URL.createObjectURL(file) : ""

      return {
        ...current,
        mainImageFile: file,
        mainImagePreviewUrl: nextPreviewUrl,
        imageUrl: file
          ? nextPreviewUrl
          : current.mainImagePreviewUrl
            ? ""
            : current.imageUrl,
        thumbnailUrl: "",
        originalUrl: "",
      }
    })
  }

  function updateGalleryImageFiles(files: File[]) {
    setForm((current) => {
      revokeProductPreviewUrls(current.galleryImagePreviewUrls)
      const nextFiles = files.slice(0, maxProductImages - 1)
      const nextPreviewUrls = nextFiles.map((file) => URL.createObjectURL(file))

      return {
        ...current,
        galleryImageFiles: nextFiles,
        galleryImagePreviewUrls: nextPreviewUrls,
      }
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("")

    try {
      const jsonForm = createProductFormFromJson(JSON.parse(jsonText))
      const submittedForm = {
        ...jsonForm,
        mainImageFile: form.mainImageFile,
        mainImagePreviewUrl: form.mainImagePreviewUrl,
        galleryImageFiles: form.galleryImageFiles,
        galleryImagePreviewUrls: form.galleryImagePreviewUrls,
        imageUrl: form.mainImageFile ? form.imageUrl : jsonForm.imageUrl,
      }

      await onCreate(submittedForm)
      handleOpenChange(false)
    } catch (error) {
      console.error("Error creating product from JSON", error)
      setStatus(
        error instanceof SyntaxError
          ? "Paste valid product JSON."
          : "Product could not be created from JSON."
      )
    }
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>
        <PackagePlusIcon data-icon="inline-start" aria-hidden="true" />
        Create with JSON
      </Button>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create product with JSON</DialogTitle>
            <DialogDescription>
              Paste product data, then select a main image and optional gallery
              images.
            </DialogDescription>
          </DialogHeader>
          <form
            id="create-product-json-form"
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <Field>
              <FieldLabel htmlFor="product-json">Product JSON</FieldLabel>
              <Textarea
                id="product-json"
                className="min-h-64 resize-y font-mono text-sm"
                placeholder={`{
  "title": "Great Wave Print",
  "description": "Archival Japanese-inspired wall art.",
  "price": 159.99,
  "currency": "USD",
  "category": "Print",
  "style": "Ukiyo-e",
  "theme": "Great Wave & Sea",
  "orientation": "Landscape",
  "size": "18x24 in",
  "stock_quantity": 10
}`}
                value={jsonText}
                onChange={(event) => setJsonText(event.target.value)}
              />
              <FieldDescription>
                Slug is optional. If omitted, it will be generated from title.
              </FieldDescription>
            </Field>

            <ProductMainImageUploadField
              idPrefix="json-product"
              imageUrl={form.imageUrl}
              mainImageFile={form.mainImageFile}
              mainImagePreviewUrl={form.mainImagePreviewUrl}
              onMainImageFileChange={updateMainImageFile}
            />

            <ProductGalleryImageUploadField
              idPrefix="json-product"
              galleryImageFiles={form.galleryImageFiles}
              galleryImagePreviewUrls={form.galleryImagePreviewUrls}
              onGalleryImageFilesChange={updateGalleryImageFiles}
            />

            {status ? (
              <p className="text-sm text-muted-foreground">{status}</p>
            ) : null}
          </form>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-product-json-form"
              disabled={isSaving}
            >
              <PackagePlusIcon data-icon="inline-start" aria-hidden="true" />
              {isSaving ? "Creating..." : "Create product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ProductCreatePanel({
  status,
  isSaving,
  onCancel,
  onCreateWithJson,
  onSubmit,
}: {
  status: string
  isSaving: boolean
  onCancel: () => void
  onCreateWithJson: (form: ProductForm) => Promise<void>
  onSubmit: (event: FormEvent<HTMLFormElement>, form: ProductForm) => void
}) {
  const [form, setForm] = useState<ProductForm>(() => createEmptyProductForm())
  const [isSlugEdited, setIsSlugEdited] = useState(false)

  function updateField(field: keyof ProductForm, value: string) {
    if (field === "title") {
      setForm((current) => ({
        ...current,
        title: value,
        slug: isSlugEdited ? current.slug : createProductSlug(value),
      }))
      return
    }

    if (field === "slug") {
      setIsSlugEdited(true)
      setForm((current) => ({
        ...current,
        slug: createProductSlug(value),
      }))
      return
    }

    setForm((current) => ({ ...current, [field]: value }))
  }

  function updateMainImageFile(file: File | null) {
    setForm((current) => {
      revokeProductPreviewUrls([current.mainImagePreviewUrl])
      const nextPreviewUrl = file ? URL.createObjectURL(file) : ""

      return {
        ...current,
        mainImageFile: file,
        mainImagePreviewUrl: nextPreviewUrl,
        imageUrl: file
          ? nextPreviewUrl
          : current.mainImagePreviewUrl
            ? ""
            : current.imageUrl,
        thumbnailUrl: "",
        originalUrl: "",
      }
    })
  }

  function updateGalleryImageFiles(files: File[]) {
    setForm((current) => {
      revokeProductPreviewUrls(current.galleryImagePreviewUrls)
      const nextFiles = files.slice(0, maxProductImages - 1)
      const nextPreviewUrls = nextFiles.map((file) => URL.createObjectURL(file))

      return {
        ...current,
        galleryImageFiles: nextFiles,
        galleryImagePreviewUrls: nextPreviewUrls,
      }
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-3xl font-semibold tracking-normal">
            New product
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <ProductJsonCreateDialog
            isSaving={isSaving}
            onCreate={onCreateWithJson}
          />
          <Button disabled={isSaving} form="create-product-form" type="submit">
            <PackagePlusIcon data-icon="inline-start" aria-hidden="true" />
            {isSaving ? "Adding..." : "Add product"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <form
            autoComplete="off"
            className="flex flex-col gap-8"
            id="create-product-form"
            onSubmit={(event) => onSubmit(event, form)}
          >
            <ProductFormFields
              form={form}
              onFieldChange={updateField}
              onGalleryImageFilesChange={updateGalleryImageFiles}
              onMainImageFileChange={updateMainImageFile}
              twoColumns
            />
          </form>
        </CardContent>
        {status ? (
          <CardFooter>
            <p className="text-sm text-muted-foreground">{status}</p>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}

function ProductEditPanel({
  form,
  product,
  status,
  isSaving,
  onCancel,
  onFieldChange,
  onGalleryImageFilesChange,
  onMainImageFileChange,
  onSubmit,
}: {
  form: ProductForm
  product: Product | null
  status: string
  isSaving: boolean
  onCancel: () => void
  onFieldChange: (field: keyof ProductForm, value: string) => void
  onGalleryImageFilesChange: (files: File[]) => void
  onMainImageFileChange: (file: File | null) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  if (!product) {
    return <p className="text-sm text-muted-foreground">Loading product...</p>
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold tracking-normal">
              Edit product
            </h1>
            <p className="text-sm text-muted-foreground">{product.title}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={isSaving} form="edit-product-form" type="submit">
            <SaveIcon data-icon="inline-start" aria-hidden="true" />
            {isSaving ? "Updating..." : "Update product"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <form
            autoComplete="off"
            className="flex flex-col gap-8"
            id="edit-product-form"
            onSubmit={onSubmit}
          >
            <ProductFormFields
              form={form}
              onFieldChange={onFieldChange}
              onGalleryImageFilesChange={onGalleryImageFilesChange}
              onMainImageFileChange={onMainImageFileChange}
              twoColumns
            />
          </form>
        </CardContent>
        {status ? (
          <CardFooter>
            <p className="text-sm text-muted-foreground">{status}</p>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}

function ProductFormFields({
  form,
  onFieldChange,
  onGalleryImageFilesChange,
  onMainImageFileChange,
  twoColumns = false,
}: {
  form: ProductForm
  onFieldChange: (field: keyof ProductForm, value: string) => void
  onGalleryImageFilesChange: (files: File[]) => void
  onMainImageFileChange: (file: File | null) => void
  twoColumns?: boolean
}) {
  return (
    <FieldSet>
      <FieldGroup className={twoColumns ? "grid gap-6 lg:grid-cols-2" : ""}>
        <Field>
          <FieldLabel htmlFor="product-title">Title</FieldLabel>
          <Input
            autoComplete="off"
            id="product-title"
            name="title"
            onChange={(event) => onFieldChange("title", event.target.value)}
            placeholder="Azure Abstract Study"
            value={form.title}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-slug">Slug</FieldLabel>
          <Input
            autoComplete="off"
            id="product-slug"
            name="slug"
            onChange={(event) => onFieldChange("slug", event.target.value)}
            placeholder="azure-abstract-study"
            value={form.slug}
          />
        </Field>

        <Field className={twoColumns ? "lg:col-span-2" : ""}>
          <FieldLabel htmlFor="product-description">Description</FieldLabel>
          <Input
            autoComplete="off"
            id="product-description"
            name="description"
            onChange={(event) =>
              onFieldChange("description", event.target.value)
            }
            placeholder="Short storefront description"
            value={form.description}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="product-price">Price</FieldLabel>
          <Input
            autoComplete="off"
            id="product-price"
            inputMode="decimal"
            name="price"
            onChange={(event) => onFieldChange("price", event.target.value)}
            placeholder="159.99"
            value={form.price}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-currency">Currency</FieldLabel>
          <Input
            autoComplete="off"
            id="product-currency"
            name="currency"
            onChange={(event) => onFieldChange("currency", event.target.value)}
            value={form.currency}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-stock">Stock</FieldLabel>
          <Input
            autoComplete="off"
            id="product-stock"
            inputMode="numeric"
            name="stockQuantity"
            onChange={(event) =>
              onFieldChange("stockQuantity", event.target.value)
            }
            placeholder="10"
            value={form.stockQuantity}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-category">Category</FieldLabel>
          <Input
            autoComplete="off"
            id="product-category"
            name="category"
            onChange={(event) => onFieldChange("category", event.target.value)}
            placeholder="Print"
            value={form.category}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-style">Style</FieldLabel>
          <Input
            autoComplete="off"
            id="product-style"
            name="style"
            onChange={(event) => onFieldChange("style", event.target.value)}
            placeholder="Abstract"
            value={form.style}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-theme">Theme</FieldLabel>
          <Input
            autoComplete="off"
            id="product-theme"
            name="theme"
            onChange={(event) => onFieldChange("theme", event.target.value)}
            placeholder="Modern"
            value={form.theme}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-orientation">Orientation</FieldLabel>
          <Input
            autoComplete="off"
            id="product-orientation"
            name="orientation"
            onChange={(event) =>
              onFieldChange("orientation", event.target.value)
            }
            placeholder="Portrait"
            value={form.orientation}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-size">Size</FieldLabel>
          <Input
            autoComplete="off"
            id="product-size"
            name="size"
            onChange={(event) => onFieldChange("size", event.target.value)}
            placeholder="18x24 in"
            value={form.size}
          />
        </Field>

        <ProductMainImageUploadField
          className={twoColumns ? "lg:col-span-2" : ""}
          imageUrl={form.imageUrl}
          mainImageFile={form.mainImageFile}
          mainImagePreviewUrl={form.mainImagePreviewUrl}
          onMainImageFileChange={onMainImageFileChange}
        />

        <ProductGalleryImageUploadField
          className={twoColumns ? "lg:col-span-2" : ""}
          galleryImageFiles={form.galleryImageFiles}
          galleryImagePreviewUrls={form.galleryImagePreviewUrls}
          onGalleryImageFilesChange={onGalleryImageFilesChange}
        />

        <Field>
          <FieldLabel htmlFor="product-thumbnail-url">Thumbnail URL</FieldLabel>
          <Input
            autoComplete="off"
            id="product-thumbnail-url"
            name="thumbnailUrl"
            onChange={(event) =>
              onFieldChange("thumbnailUrl", event.target.value)
            }
            placeholder="https://..."
            value={form.thumbnailUrl}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-original-url">Original URL</FieldLabel>
          <Input
            autoComplete="off"
            id="product-original-url"
            name="originalUrl"
            onChange={(event) =>
              onFieldChange("originalUrl", event.target.value)
            }
            placeholder="https://..."
            value={form.originalUrl}
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}

function ProductMainImageUploadField({
  className,
  idPrefix = "product",
  imageUrl,
  mainImageFile,
  mainImagePreviewUrl,
  onMainImageFileChange,
}: {
  className?: string
  idPrefix?: string
  imageUrl: string
  mainImageFile: File | null
  mainImagePreviewUrl: string
  onMainImageFileChange: (file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const previewUrl = mainImagePreviewUrl || imageUrl
  const inputId = `${idPrefix}-main-image-file`
  const hasImage = previewUrl.trim().length > 0

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    onMainImageFileChange(file)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  function clearMainImage() {
    onMainImageFileChange(null)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <Field className={className}>
      <FieldLabel htmlFor={inputId}>Main image</FieldLabel>
      <div className="flex flex-col gap-3 rounded-md border border-dashed p-4">
        {hasImage ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <img
              src={previewUrl}
              alt="Main product"
              className="aspect-square size-24 rounded-md border object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {mainImageFile?.name || "Current main image"}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {mainImageFile ? "Ready to upload" : imageUrl}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                >
                  <UploadIcon data-icon="inline-start" aria-hidden="true" />
                  Replace main image
                </Button>
                {mainImageFile ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={clearMainImage}
                  >
                    <TrashIcon data-icon="inline-start" aria-hidden="true" />
                    Remove selected
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Upload main image</p>
              <FieldDescription>
                This image is saved as the primary product image.
              </FieldDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <UploadIcon data-icon="inline-start" aria-hidden="true" />
              Upload main image
            </Button>
          </div>
        )}
        <Input
          ref={inputRef}
          id={inputId}
          name="mainImageFile"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>
    </Field>
  )
}

function ProductGalleryImageUploadField({
  className,
  idPrefix = "product",
  galleryImageFiles,
  galleryImagePreviewUrls,
  onGalleryImageFilesChange,
}: {
  className?: string
  idPrefix?: string
  galleryImageFiles: File[]
  galleryImagePreviewUrls: string[]
  onGalleryImageFilesChange: (files: File[]) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const hasSelectedImages = galleryImageFiles.length > 0
  const inputId = `${idPrefix}-gallery-image-files`

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])

    if (files.length === 0) {
      return
    }

    onGalleryImageFilesChange(
      [...galleryImageFiles, ...files].slice(0, maxProductImages - 1)
    )

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  function removeSelectedImage(index: number) {
    onGalleryImageFilesChange(
      galleryImageFiles.filter((_, imageIndex) => imageIndex !== index)
    )
  }

  function clearSelectedImages() {
    onGalleryImageFilesChange([])

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <Field className={className}>
      <FieldLabel htmlFor={inputId}>Gallery images</FieldLabel>
      <div className="flex flex-col gap-3 rounded-md border border-dashed p-4">
        {hasSelectedImages ? (
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImageFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex min-w-0 gap-3 rounded-md border p-2"
                >
                  <img
                    src={galleryImagePreviewUrls[index]}
                    alt={file.name}
                    className="aspect-square size-20 rounded-md border object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        Gallery image {index + 1}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {file.name}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeSelectedImage(index)}
                    >
                      <TrashIcon data-icon="inline-start" aria-hidden="true" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={galleryImageFiles.length >= maxProductImages - 1}
                onClick={() => inputRef.current?.click()}
              >
                <UploadIcon data-icon="inline-start" aria-hidden="true" />
                Add gallery images
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={clearSelectedImages}
              >
                <TrashIcon data-icon="inline-start" aria-hidden="true" />
                Clear selected
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Upload gallery images</p>
              <FieldDescription>
                Select up to {maxProductImages - 1} optional gallery images.
              </FieldDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <UploadIcon data-icon="inline-start" aria-hidden="true" />
              Upload gallery images
            </Button>
          </div>
        )}
        <Input
          ref={inputRef}
          id={inputId}
          name="galleryImageFiles"
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>
    </Field>
  )
}

function ArtStyleImageUploadField({
  image,
  onImageChange,
}: {
  image: ArtStyleImageUpload
  onImageChange: (file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    onImageChange(file)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <Field>
      <FieldLabel htmlFor="art-style-image-file">Style image</FieldLabel>
      <div className="flex flex-col gap-3 rounded-md border border-dashed p-4">
        {image.previewUrl ? (
          <div className="flex gap-3">
            <img
              src={image.previewUrl}
              alt="Selected art style"
              className="aspect-square size-24 rounded-md object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="truncate text-sm font-medium">
                {image.file?.name || "Selected image"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                >
                  <UploadIcon data-icon="inline-start" aria-hidden="true" />
                  Replace image
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onImageChange(null)}
                >
                  <TrashIcon data-icon="inline-start" aria-hidden="true" />
                  Remove selected
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Upload style image</p>
              <FieldDescription>
                Select one image for this art style.
              </FieldDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <UploadIcon data-icon="inline-start" aria-hidden="true" />
              Upload image
            </Button>
          </div>
        )}
        <Input
          ref={inputRef}
          id="art-style-image-file"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>
    </Field>
  )
}

function ArtStyleJsonDialog({
  isSaving,
  mode,
  style,
  onSave,
}: {
  isSaving: boolean
  mode: "create" | "edit" | "patch"
  style?: ArtStyle
  onSave: (
    payload: SaveArtStylePayload,
    imageFile: File | null
  ) => Promise<void>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [jsonText, setJsonText] = useState("")
  const [image, setImage] = useState<ArtStyleImageUpload>({
    file: null,
    previewUrl: "",
  })
  const [status, setStatus] = useState("")
  const title =
    mode === "create"
      ? "Create style with JSON"
      : mode === "edit"
        ? "Update style with JSON"
        : "Patch style with JSON"

  function createInitialJson() {
    if (!style) {
      return `{
  "origin": "japanese",
  "style": "Abstract",
  "description": "Modern abstract wall style",
  "tags": ["minimal", "modern"]
}`
    }

    return JSON.stringify(
      {
        origin: style.origin,
        style: style.style,
        description: style.description,
        tags: style.tags,
        image_url: style.image_url,
        blob_name: style.blob_name,
      },
      null,
      2
    )
  }

  function resetDialog() {
    if (image.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(image.previewUrl)
    }

    setJsonText("")
    setImage({ file: null, previewUrl: "" })
    setStatus("")
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open)

    if (open) {
      setJsonText(createInitialJson())
      setStatus("")
      return
    }

    resetDialog()
  }

  function updateImage(file: File | null) {
    setImage((current) => {
      if (current.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(current.previewUrl)
      }

      return {
        file,
        previewUrl: file ? URL.createObjectURL(file) : "",
      }
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("")

    try {
      const payload = createArtStylePayloadFromJson(JSON.parse(jsonText))

      await onSave(payload, image.file)
      handleOpenChange(false)
    } catch (error) {
      console.error("Error saving art style JSON", error)
      setStatus(
        error instanceof SyntaxError
          ? "Paste valid style JSON."
          : "Art style could not be saved."
      )
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={mode === "create" ? "default" : "outline"}
        disabled={isSaving}
        onClick={() => handleOpenChange(true)}
      >
        {mode === "create" ? (
          <PaletteIcon data-icon="inline-start" aria-hidden="true" />
        ) : mode === "edit" ? (
          <EditIcon data-icon="inline-start" aria-hidden="true" />
        ) : (
          <SaveIcon data-icon="inline-start" aria-hidden="true" />
        )}
        {mode === "create"
          ? "Create style with JSON"
          : mode === "edit"
            ? "Update JSON"
            : "Patch JSON"}
      </Button>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Paste the style JSON and optionally upload one image.
            </DialogDescription>
          </DialogHeader>
          <form
            id={`art-style-json-${mode}-form`}
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <Field>
              <FieldLabel htmlFor={`art-style-json-${mode}`}>
                Style JSON
              </FieldLabel>
              <Textarea
                id={`art-style-json-${mode}`}
                className="min-h-60 resize-y font-mono text-sm"
                value={jsonText}
                onChange={(event) => setJsonText(event.target.value)}
              />
              <FieldDescription>
                If an image is uploaded, image_url and blob_name will be taken
                from the upload response.
              </FieldDescription>
            </Field>
            <ArtStyleImageUploadField
              image={image}
              onImageChange={updateImage}
            />
            {status ? (
              <p className="text-sm text-muted-foreground">{status}</p>
            ) : null}
          </form>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form={`art-style-json-${mode}-form`}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save style"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ArtStylesPanel({
  styles,
  isDeleteDialogOpen,
  isDeleting,
  isLoading,
  isSaving,
  selectedStyleIds,
  status,
  onCreateStyle,
  onDeleteDialogOpenChange,
  onDeleteSelected,
  onPatchSelected,
  onSelectedStyleIdsChange,
  onUpdateStyle,
}: {
  styles: ArtStyle[]
  isDeleteDialogOpen: boolean
  isDeleting: boolean
  isLoading: boolean
  isSaving: boolean
  selectedStyleIds: number[]
  status: string
  onCreateStyle: (
    payload: SaveArtStylePayload,
    imageFile: File | null
  ) => Promise<void>
  onDeleteDialogOpenChange: (open: boolean) => void
  onDeleteSelected: () => void
  onPatchSelected: (
    payload: Partial<SaveArtStylePayload>,
    imageFile: File | null
  ) => Promise<void>
  onSelectedStyleIdsChange: (ids: number[]) => void
  onUpdateStyle: (
    id: number,
    payload: SaveArtStylePayload,
    imageFile: File | null
  ) => Promise<void>
}) {
  const selectedCount = selectedStyleIds.length
  const visibleStyleIds = styles.map((style) => style.id)
  const isAllVisibleSelected =
    visibleStyleIds.length > 0 &&
    visibleStyleIds.every((id) => selectedStyleIds.includes(id))
  const selectedStyle = styles.find((style) => style.id === selectedStyleIds[0])

  function toggleStyleSelection(styleId: number, checked: boolean) {
    onSelectedStyleIdsChange(
      checked
        ? [...selectedStyleIds, styleId]
        : selectedStyleIds.filter((id) => id !== styleId)
    )
  }

  function toggleVisibleSelection(checked: boolean) {
    onSelectedStyleIdsChange(checked ? visibleStyleIds : [])
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-3xl font-semibold tracking-normal">
            Art Styles
          </h1>
        </div>
        <ArtStyleJsonDialog
          isSaving={isSaving}
          mode="create"
          onSave={onCreateStyle}
        />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col p-0">
          <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
            {selectedCount > 0 ? (
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={badgeColors.blue}>
                  {selectedCount} selected
                </Badge>
                {selectedStyle && selectedCount === 1 ? (
                  <>
                    <ArtStyleJsonDialog
                      isSaving={isSaving}
                      mode="edit"
                      style={selectedStyle}
                      onSave={(payload, imageFile) =>
                        onUpdateStyle(selectedStyle.id, payload, imageFile)
                      }
                    />
                    <ArtStyleJsonDialog
                      isSaving={isSaving}
                      mode="patch"
                      style={selectedStyle}
                      onSave={(payload, imageFile) =>
                        onPatchSelected(payload, imageFile)
                      }
                    />
                  </>
                ) : null}
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={onDeleteDialogOpenChange}
                >
                  <Button
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={() => onDeleteDialogOpenChange(true)}
                  >
                    <TrashIcon data-icon="inline-start" aria-hidden="true" />
                    Delete
                  </Button>
                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogMedia>
                        <TrashIcon aria-hidden="true" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Delete art styles?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {selectedCount} selected{" "}
                        {selectedCount === 1 ? "style" : "styles"}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={onDeleteSelected}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  variant="ghost"
                  onClick={() => onSelectedStyleIdsChange([])}
                >
                  Clear selection
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Manage storefront art styles from JSON.
              </p>
            )}
            {status ? (
              <p className="text-sm text-muted-foreground">{status}</p>
            ) : null}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    aria-label="Select all art styles"
                    checked={isAllVisibleSelected}
                    onCheckedChange={toggleVisibleSelection}
                  />
                </TableHead>
                <TableHead className="min-w-72">Style</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading art styles...
                  </TableCell>
                </TableRow>
              ) : styles.length > 0 ? (
                styles.map((style) => (
                  <TableRow
                    key={style.id}
                    data-state={
                      selectedStyleIds.includes(style.id)
                        ? "selected"
                        : undefined
                    }
                  >
                    <TableCell>
                      <Checkbox
                        aria-label={`Select ${style.style}`}
                        checked={selectedStyleIds.includes(style.id)}
                        onCheckedChange={(checked) =>
                          toggleStyleSelection(style.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {style.image_url ? (
                          <img
                            src={style.image_url}
                            alt={style.style}
                            className="size-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex size-12 items-center justify-center rounded-md bg-muted">
                            <PaletteIcon aria-hidden="true" />
                          </div>
                        )}
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="font-medium">{style.style}</span>
                          <span className="max-w-64 truncate text-xs text-muted-foreground">
                            {style.blob_name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{style.origin}</TableCell>
                    <TableCell>
                      <span className="line-clamp-2">
                        {style.description}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {style.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No art styles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function CrouselPanel({
  images,
  form,
  mode,
  isDeleteDialogOpen,
  isDeleting,
  isLoading,
  isSaving,
  selectedImageIds,
  status,
  onActivateSelected,
  onCancelForm,
  onCreateImage,
  onDeactivateSelected,
  onDeleteDialogOpenChange,
  onDeleteSelected,
  onEditSelected,
  onImageFileChange,
  onImageChange,
  onSelectedImageIdsChange,
  onSubmit,
}: {
  images: CarouselImage[]
  form: CarouselImage
  mode: CarouselMode
  isDeleteDialogOpen: boolean
  isDeleting: boolean
  isLoading: boolean
  isSaving: boolean
  selectedImageIds: number[]
  status: string
  onActivateSelected: () => void
  onCancelForm: () => void
  onCreateImage: () => void
  onDeactivateSelected: () => void
  onDeleteDialogOpenChange: (open: boolean) => void
  onDeleteSelected: () => void
  onEditSelected: () => void
  onImageFileChange: (file: File | null) => void
  onImageChange: (
    field: keyof Pick<
      CarouselImage,
      "title" | "description" | "imageUrl" | "blobName" | "sortOrder"
    >,
    value: string
  ) => void
  onSelectedImageIdsChange: (ids: number[]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const selectedCount = selectedImageIds.length
  const visibleImageIds = images.map((image) => image.id)
  const isAllVisibleSelected =
    visibleImageIds.length > 0 &&
    visibleImageIds.every((id) => selectedImageIds.includes(id))
  const activeImages = images.filter((image) => image.isActive).length
  const draftImages = images.length - activeImages

  function toggleImageSelection(imageId: number, checked: boolean) {
    onSelectedImageIdsChange(
      checked
        ? [...selectedImageIds, imageId]
        : selectedImageIds.filter((id) => id !== imageId)
    )
  }

  function toggleVisibleSelection(checked: boolean) {
    onSelectedImageIdsChange(checked ? visibleImageIds : [])
  }

  if (mode !== "list") {
    const formId =
      mode === "edit" ? "edit-carousel-form" : "create-carousel-form"

    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold tracking-normal">
                {mode === "edit" ? "Edit carousel image" : "New carousel image"}
              </h1>
              {mode === "edit" ? (
                <p className="text-sm text-muted-foreground">{form.title}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={onCancelForm}>
              Cancel
            </Button>
            <Button variant="outline" disabled={isSaving} form={formId} type="submit">
              {mode === "edit" ? (
                <SaveIcon data-icon="inline-start" aria-hidden="true" />
              ) : (
                <PlusIcon data-icon="inline-start" aria-hidden="true" />
              )}
              {isSaving
                ? mode === "edit"
                  ? "Updating..."
                  : "Adding..."
                : mode === "edit"
                  ? "Update image"
                  : "Add image"}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent>
            <form
              autoComplete="off"
              className="grid gap-6 lg:grid-cols-2"
              id={formId}
              onSubmit={onSubmit}
            >
              <Field>
                <FieldLabel htmlFor="carousel-title">Title</FieldLabel>
                <Input
                  id="carousel-title"
                  name="title"
                  onChange={(event) =>
                    onImageChange("title", event.target.value)
                  }
                  placeholder="Synthetic Bloom"
                  value={form.title}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="carousel-sort-order">
                  Sort order
                </FieldLabel>
                <Input
                  id="carousel-sort-order"
                  inputMode="numeric"
                  name="sortOrder"
                  onChange={(event) =>
                    onImageChange("sortOrder", event.target.value)
                  }
                  placeholder="1"
                  value={String(form.sortOrder)}
                />
              </Field>
              <Field className="lg:col-span-2">
                <FieldLabel htmlFor="carousel-description">
                  Description
                </FieldLabel>
                <Input
                  id="carousel-description"
                  name="description"
                  onChange={(event) =>
                    onImageChange("description", event.target.value)
                  }
                  placeholder="Short slide copy"
                  value={form.description}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="carousel-image-url">Image URL</FieldLabel>
                <Input
                  id="carousel-image-url"
                  name="imageUrl"
                  onChange={(event) =>
                    onImageChange("imageUrl", event.target.value)
                  }
                  placeholder="https://..."
                  value={form.imageUrl}
                />
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <div>
                  <Badge
                    className={
                      form.isActive ? badgeColors.green : badgeColors.blue
                    }
                  >
                    {form.isActive ? "Active" : "Draft"}
                  </Badge>
                </div>
                <FieldDescription>
                  Use the list actions to activate or deactivate images.
                </FieldDescription>
              </Field>
              <CarouselImageUploadField
                className="lg:col-span-2"
                image={form}
                onDelete={() => onImageFileChange(null)}
                onFileChange={onImageFileChange}
              />
            </form>
          </CardContent>
          {status ? (
            <CardFooter>
              <p className="text-sm text-muted-foreground">{status}</p>
            </CardFooter>
          ) : null}
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-3xl font-semibold tracking-normal">Crousel</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onCreateImage}>
            <PlusIcon data-icon="inline-start" aria-hidden="true" />
            Add image
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col p-0">
          <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
            {selectedCount > 0 ? (
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={badgeColors.blue}>
                  {selectedCount} selected
                </Badge>
                <Button
                  variant="outline"
                  disabled={selectedCount !== 1}
                  onClick={onEditSelected}
                >
                  <EditIcon data-icon="inline-start" aria-hidden="true" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  disabled={isSaving}
                  onClick={onActivateSelected}
                >
                  Activate
                </Button>
                <Button
                  variant="outline"
                  disabled={isSaving}
                  onClick={onDeactivateSelected}
                >
                  Deactivate
                </Button>
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={onDeleteDialogOpenChange}
                >
                <Button
                  variant="outline"
                  disabled={isDeleting}
                  onClick={() => onDeleteDialogOpenChange(true)}
                >
                  <TrashIcon data-icon="inline-start" aria-hidden="true" />
                  Delete
                </Button>
                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogMedia>
                        <TrashIcon aria-hidden="true" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>
                        Delete carousel images?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {selectedCount} selected{" "}
                        {selectedCount === 1 ? "image" : "images"}. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={onDeleteSelected}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  variant="ghost"
                  onClick={() => onSelectedImageIdsChange([])}
                >
                  Clear selection
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {[
                  ["All", images.length],
                  ["Active", activeImages],
                  ["Draft", draftImages],
                ].map(([label, count]) => (
                  <Button
                    key={label}
                    variant={label === "All" ? "secondary" : "ghost"}
                  >
                    {label}
                    {label === "All" ? (
                      <span className="text-muted-foreground">{count}</span>
                    ) : null}
                  </Button>
                ))}
              </div>
            )}

            {selectedCount === 0 ? (
              <div className="flex gap-2">
                <Button variant="outline" size="icon-sm">
                  <SlidersHorizontalIcon />
                  <span className="sr-only">Filter</span>
                </Button>
                <Button variant="outline" size="icon-sm">
                  <ArrowDownUpIcon />
                  <span className="sr-only">Sort</span>
                </Button>
              </div>
            ) : null}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    aria-label="Select all carousel images"
                    checked={isAllVisibleSelected}
                    onCheckedChange={toggleVisibleSelection}
                  />
                </TableHead>
                <TableHead className="min-w-80">
                  <div className="flex items-center gap-1">
                    Image
                    <ChevronDownIcon aria-hidden="true" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Sort order</TableHead>
                <TableHead>Blob</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading carousel images...
                  </TableCell>
                </TableRow>
              ) : images.length > 0 ? (
                images.map((image) => (
                  <TableRow
                    key={image.id}
                    data-state={
                      selectedImageIds.includes(image.id)
                        ? "selected"
                        : undefined
                    }
                  >
                    <TableCell>
                      <Checkbox
                        aria-label={`Select ${image.title || "carousel image"}`}
                        checked={selectedImageIds.includes(image.id)}
                        onCheckedChange={(checked) =>
                          toggleImageSelection(image.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={image.imageUrl}
                          alt={image.title || "Carousel image"}
                          className="aspect-video w-20 rounded-md border object-cover"
                        />
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="font-medium">
                            {image.title || "Untitled image"}
                          </span>
                          <span className="max-w-72 truncate text-xs text-muted-foreground">
                            {image.imageUrl}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          image.isActive ? badgeColors.green : badgeColors.blue
                        }
                      >
                        {image.isActive ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="line-clamp-2 max-w-md text-sm">
                        {image.description || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {image.sortOrder}
                    </TableCell>
                    <TableCell>
                      <span className="max-w-56 truncate text-xs text-muted-foreground">
                        {image.blobName || "-"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No carousel images found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {status ? (
          <CardFooter className="border-t">
            <p className="text-sm text-muted-foreground">{status}</p>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}

function CarouselImageUploadField({
  className,
  image,
  onDelete,
  onFileChange,
}: {
  className?: string
  image: CarouselImage
  onDelete: () => void
  onFileChange: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const previewUrl = image.previewUrl || image.imageUrl
  const hasImage = previewUrl.trim().length > 0

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    onFileChange(file)
  }

  function handleDelete() {
    onDelete()

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <Field className={className}>
      <FieldLabel htmlFor={`carousel-image-${image.id}`}>Image</FieldLabel>
      <div className="flex flex-col gap-3 rounded-md border border-dashed p-4">
        {hasImage ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <img
              src={previewUrl}
              alt={image.title || "Carousel slide"}
              className="aspect-video w-full rounded-md border object-cover sm:w-40"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="truncate text-sm font-medium">
                {image.imageFile?.name || "Carousel image"}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {image.imageFile ? "Ready to upload" : image.imageUrl}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                >
                  <UploadIcon data-icon="inline-start" aria-hidden="true" />
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <TrashIcon data-icon="inline-start" aria-hidden="true" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FieldDescription>
              Select an image file to preview it before saving.
            </FieldDescription>
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <UploadIcon data-icon="inline-start" aria-hidden="true" />
              Upload image
            </Button>
          </div>
        )}
        <Input
          ref={inputRef}
          id={`carousel-image-${image.id}`}
          name="carouselImage"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>
    </Field>
  )
}
