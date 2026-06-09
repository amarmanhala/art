import {
  AtSignIcon,
  CameraIcon,
  ChevronRightIcon,
  CodeIcon,
  GlobeIcon,
  ImageIcon,
  MessageCircleIcon,
  MoonIcon,
  MusicIcon,
  SendIcon,
  ShoppingCartIcon,
  SunIcon,
} from "lucide-react"
import { type FormEvent, type ReactNode, useState } from "react"
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { useTheme } from "@/components/theme-provider"
import { Input } from "@/components/ui/input"

const featuredArtworks = [
  "Synthetic Bloom",
  "Neural Coastline",
  "Latent City Study",
]

const heroSlides = [
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

const featuredStories = [
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

const artworkSurfaces = ["bg-muted", "bg-secondary", "bg-accent", "bg-input/50"]

type Artwork = {
  title: string
  description: string
  price: string
  surface: string
}

const artworkCategories = [
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

const footerColumns = [
  [
    {
      heading: "Marketplace",
      links: [
        "Featured Artworks",
        "New Drops",
        "Popular Artists",
        "Gift Cards",
      ],
    },
    {
      heading: "Collections",
      links: ["Minimalist", "Abstract", "Watercolor", "Oil Painting"],
    },
    {
      heading: "Trust",
      links: ["Buyer Protection", "Licensing", "Authenticity", "Security"],
    },
  ],
  [
    {
      heading: "Artists",
      links: ["Sell Art", "Creator Tools", "Artist Guidelines", "Pricing"],
    },
    {
      heading: "Resources",
      links: ["Editorial", "Collecting 101", "Style Guides", "Help Center"],
    },
  ],
  [
    {
      heading: "For Business",
      links: ["Business Overview", "Interior Projects", "Contact Sales"],
    },
    {
      heading: "Company",
      links: ["About Us", "Careers", "Brand", "Press"],
    },
    {
      heading: "Support",
      links: ["Contact", "Order Status", "Returns"],
    },
  ],
  [
    {
      heading: "More",
      links: ["News", "Stories", "Academy", "Podcast", "RSS"],
    },
    {
      heading: "Terms & Policies",
      links: ["Terms of Use", "Privacy Policy", "Other Policies"],
    },
  ],
]

const socialLinks = [
  { label: "Updates", icon: MessageCircleIcon },
  { label: "Video", icon: CameraIcon },
  { label: "Community", icon: AtSignIcon },
  { label: "Developers", icon: CodeIcon },
  { label: "Audio", icon: MusicIcon },
  { label: "Newsletter", icon: SendIcon },
]

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function createCategoryArtworks(category: string): Artwork[] {
  return ["Study", "Edition", "Composition", "Collection"].map(
    (name, index) => ({
      title: `${category} ${name}`,
      description: `AI generated ${category.toLowerCase()} artwork with gallery-ready digital detail.`,
      price: `$${320 + index * 85}`,
      surface: artworkSurfaces[index],
    })
  )
}

function getArtworkSlug(artwork: Artwork) {
  return slugify(artwork.title)
}

const allArtworks = [
  ...featuredStories,
  ...artworkCategories.flatMap((category) => createCategoryArtworks(category)),
]

function findArtwork(slug?: string) {
  return allArtworks.find((artwork) => getArtworkSlug(artwork) === slug)
}

function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const canSubmitSearch = searchQuery.trim().length > 0

  return (
    <header className="border-b">
      <div className="flex min-h-16 items-center gap-4 px-6">
        <Button
          variant="outline"
          size="icon-lg"
          nativeButton={false}
          render={<Link to="/" aria-label="AI art marketplace home" />}
        >
          <ImageIcon aria-hidden="true" />
        </Button>

        <form className="relative min-w-0 flex-1 md:max-w-xl" role="search">
          <Input
            aria-label="Search artwork"
            className="pr-11"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by artist, style, theme, tag, etc."
            type="text"
            value={searchQuery}
          />
          {canSubmitSearch ? (
            <Button
              aria-label="Submit search"
              className="absolute top-1/2 right-1 -translate-y-1/2"
              size="icon-sm"
              type="submit"
            >
              <ChevronRightIcon aria-hidden="true" />
            </Button>
          ) : null}
        </form>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/login" />}
          >
            Log In
          </Button>
          <Button nativeButton={false} render={<Link to="/signup" />}>
            Sign Up
          </Button>
          <Button
            aria-label="Cart"
            nativeButton={false}
            render={<Link to="/cart" />}
            size="icon-lg"
            variant="outline"
          >
            <ShoppingCartIcon aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}

function Page({ title }: { title: string }) {
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

function ArtworkSection({
  title,
  artworks,
}: {
  title: string
  artworks: Artwork[]
}) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-14">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-medium">{title}</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {artworks.map((artwork, index) => (
          <article key={artwork.title} className="flex flex-col gap-3">
            <Link
              to={`/art/${getArtworkSlug(artwork)}`}
              className={`flex aspect-[3/2] min-h-72 items-center justify-center rounded-2xl border ${artwork.surface}`}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <ImageIcon aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  Artwork placeholder {index + 1}
                </p>
              </div>
            </Link>
            <div className="flex flex-col gap-2">
              <Link to={`/art/${getArtworkSlug(artwork)}`}>
                <h2 className="text-xl leading-tight font-medium">
                  {artwork.title}
                </h2>
              </Link>
              <p className="text-sm leading-6 text-muted-foreground">
                {artwork.description}
              </p>
              <p className="font-medium">{artwork.price}</p>
            </div>
          </article>
        ))}
      </div>

      <Button className="w-fit self-end" variant="outline">
        View all arts
      </Button>
    </section>
  )
}

function ArtDetailPage() {
  const { slug } = useParams()
  const artwork = findArtwork(slug) ?? featuredStories[0]
  const similarArtworks = allArtworks
    .filter((item) => item.title !== artwork.title)
    .slice(0, 4)

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_28rem]">
        <div
          className={`flex aspect-[4/3] min-h-[30rem] items-center justify-center rounded-2xl border ${artwork.surface}`}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <ImageIcon aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Artwork placeholder</p>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              AI Generated Artwork
            </p>
            <h1 className="text-4xl font-medium">{artwork.title}</h1>
            <p className="text-base leading-7 text-muted-foreground">
              {artwork.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 border-y py-6">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="text-3xl font-medium">{artwork.price}</span>
          </div>

          <div className="grid gap-3">
            <Button>Add to cart</Button>
            <Button variant="outline">Make an offer</Button>
          </div>

          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Format</dt>
              <dd className="font-medium">Digital print</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Edition</dt>
              <dd className="font-medium">1 of 25</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">License</dt>
              <dd className="font-medium">Personal use</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex max-w-3xl flex-col gap-8">
          <h2 className="text-4xl font-medium">About this art</h2>
          <div className="flex flex-col gap-7 text-lg leading-9">
            <p>
              {artwork.title} explores how prompts, model interpretation, and
              human selection can become part of a collectible visual language.
              The piece is composed as a calm digital object that can sit in a
              modern collection without losing the traces of its algorithmic
              origin.
            </p>
            <p>
              Each placeholder work in this marketplace represents how the final
              store can connect AI generation, curation, licensing, and purchase
              flows. The current content is mock data, ready to be replaced by
              generated images and metadata from your integration.
            </p>
          </div>
        </div>
      </section>

      <ArtworkSection title="Similar Arts" artworks={similarArtworks} />
    </main>
  )
}

function Footer() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <footer className="border-t px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-10">
              {column.map((group) => (
                <nav key={group.heading} className="flex flex-col gap-4">
                  <h2 className="text-sm font-medium text-muted-foreground">
                    {group.heading}
                  </h2>
                  <ul className="flex flex-col gap-4">
                    {group.links.map((link) => (
                      <li key={link}>
                        <Link className="text-sm font-medium" to="/">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            {socialLinks.map((item) => {
              const Icon = item.icon

              return (
                <Link key={item.label} aria-label={item.label} to="/">
                  <Icon aria-hidden="true" className="size-4" />
                </Link>
              )
            })}
          </div>

          <div className="flex flex-col gap-4 text-sm font-medium md:flex-row md:items-center">
            <span>AI Art Market © 2026</span>
            <Link to="/">Manage Cookies</Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              onClick={() => setTheme(isDark ? "light" : "dark")}
              size="icon"
              type="button"
              variant="outline"
            >
              {isDark ? (
                <SunIcon aria-hidden="true" />
              ) : (
                <MoonIcon aria-hidden="true" />
              )}
            </Button>
            <Button variant="secondary">
              <GlobeIcon data-icon="inline-start" />
              English
              <span className="text-muted-foreground">United States</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

function QuoteSection() {
  return (
    <section className="border-t px-6 py-20">
      <figure className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
        <blockquote className="text-3xl leading-tight font-medium md:text-5xl">
          “Art enables us to find ourselves and lose ourselves at the same
          time.”
        </blockquote>
        <figcaption className="text-sm font-medium">—Thomas Merton</figcaption>
      </figure>
    </section>
  )
}

function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-10 md:py-14 lg:grid-cols-2">
        <div className="flex max-w-xl flex-col gap-8">
          <div className="flex flex-col gap-5">
            <h1 className="text-5xl font-medium tracking-normal md:text-7xl">
              Collect AI generated art
            </h1>
            <p className="max-w-lg text-lg leading-8 text-muted-foreground">
              Discover original digital works shaped by artists, prompts, and
              intelligent tools. Browse limited collections, save your favorite
              pieces, and build a collection that reflects the next era of
              visual culture.
            </p>
            <p className="text-sm text-muted-foreground">
              Curated drops, mock marketplace data, and placeholder artwork for
              now.
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

        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {heroSlides.map((slide, index) => (
              <CarouselItem key={slide.title}>
                <div className="flex aspect-[4/3] min-h-72 flex-col justify-end rounded-3xl border bg-muted p-8 md:min-h-[28rem] lg:min-h-[30rem]">
                  <div className="flex max-w-sm flex-col gap-2 rounded-3xl bg-background p-6 shadow-sm">
                    <p className="text-xs text-muted-foreground">
                      Placeholder #{index + 1}
                    </p>
                    <h2 className="text-2xl font-medium">{slide.title}</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      <ArtworkSection title="Featured Artworks" artworks={featuredStories} />

      {artworkCategories.map((category) => (
        <ArtworkSection
          key={category}
          title={category}
          artworks={createCategoryArtworks(category)}
        />
      ))}
    </main>
  )
}

function AuthLayout({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="flex justify-center px-6 py-12">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </main>
  )
}

function LoginPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <AuthLayout
      title="Log In"
      description="Access your account to manage saved AI artworks."
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="login-email">Email</FieldLabel>
            <Input
              autoComplete="email"
              id="login-email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
            <Input
              autoComplete="current-password"
              id="login-password"
              name="password"
              type="password"
            />
          </Field>
        </FieldGroup>
        <Button type="submit">Log In</Button>
      </form>
    </AuthLayout>
  )
}

function SignupPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <AuthLayout
      title="Sign Up"
      description="Create an account to buy and collect AI generated art."
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="signup-first-name">First name</FieldLabel>
            <Input
              autoComplete="given-name"
              id="signup-first-name"
              name="firstName"
              type="text"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-last-name">Last name</FieldLabel>
            <Input
              autoComplete="family-name"
              id="signup-last-name"
              name="lastName"
              type="text"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-email">Email</FieldLabel>
            <Input
              autoComplete="email"
              id="signup-email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-password">Password</FieldLabel>
            <Input
              autoComplete="new-password"
              id="signup-password"
              name="password"
              type="password"
            />
            <FieldDescription>
              Use at least 8 characters for the mock account.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <Button type="submit">Create Account</Button>
      </form>
    </AuthLayout>
  )
}

export function App() {
  const location = useLocation()
  const isArtDetailPage = location.pathname.startsWith("/art/")

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buy" element={<Page title="Buy AI Art" />} />
        <Route path="/artists" element={<Page title="AI Artists" />} />
        <Route path="/collections" element={<Page title="Collections" />} />
        <Route path="/editorial" element={<Page title="Editorial" />} />
        <Route path="/art/:slug" element={<ArtDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cart" element={<Page title="Cart" />} />
      </Routes>
      {isArtDetailPage ? null : <QuoteSection />}
      <Footer />
    </>
  )
}

export default App
