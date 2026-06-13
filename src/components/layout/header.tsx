import { ChevronRightIcon, ImageIcon, ShoppingCartIcon } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
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
