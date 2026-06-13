import {
  AtSignIcon,
  CameraIcon,
  CodeIcon,
  GlobeIcon,
  MessageCircleIcon,
  MoonIcon,
  MusicIcon,
  SendIcon,
  SunIcon,
} from "lucide-react"
import { Link } from "react-router-dom"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

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

export function Footer() {
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
