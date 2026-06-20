import {
  ChevronRightIcon,
  HeartIcon,
  LogOutIcon,
  ShoppingBagIcon,
} from "lucide-react"
import { type FormEvent, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/auth"
import { useCart } from "@/contexts/cart-context"
import { useLikedArts } from "@/contexts/liked-arts-context"
import { cn } from "@/lib/utils"
import { logout as logoutRequest } from "@/services/auth"

function getUserInitials(email: string, firstName?: string, lastName?: string) {
  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((name) => name?.charAt(0))
    .join("")

  return initials || email.charAt(0).toUpperCase() || "U"
}

function HeaderSearch({ initialSearchQuery }: { initialSearchQuery: string }) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const location = useLocation()
  const navigate = useNavigate()
  const canSubmitSearch = searchQuery.trim().length > 0

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextQuery = searchQuery.trim()
    const searchParams =
      location.pathname === "/art"
        ? new URLSearchParams(location.search)
        : new URLSearchParams()

    searchParams.delete("page")

    if (nextQuery) {
      searchParams.set("q", nextQuery)
    } else {
      searchParams.delete("q")
    }

    const nextSearch = searchParams.toString()
    navigate(nextSearch ? `/art?${nextSearch}` : "/art")
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value)

    if (value.trim() || location.pathname !== "/art") {
      return
    }

    const searchParams = new URLSearchParams(location.search)

    if (!searchParams.has("q")) {
      return
    }

    searchParams.delete("q")
    searchParams.delete("page")

    const nextSearch = searchParams.toString()
    navigate(nextSearch ? `/art?${nextSearch}` : "/art")
  }

  return (
    <form
      className="relative min-w-0 flex-1 md:max-w-xl"
      role="search"
      onSubmit={handleSearchSubmit}
    >
      <Input
        aria-label="Search artwork"
        className="pr-11"
        onChange={(event) => handleSearchChange(event.target.value)}
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
  )
}

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logout, token, user } = useAuth()
  const { itemCount } = useCart()
  const { likedCount } = useLikedArts()
  const isLoginPage = location.pathname === "/login"
  const isSignupPage = location.pathname === "/signup"
  const isAuthPage = isLoginPage || isSignupPage
  const userInitials = user
    ? getUserInitials(user.email, user.firstName, user.lastName)
    : "U"
  const cartLabel = itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"
  const initialSearchQuery =
    location.pathname === "/art"
      ? (new URLSearchParams(location.search).get("q") ?? "")
      : ""

  async function handleLogout() {
    try {
      await logoutRequest(token)
    } catch (error) {
      console.error("Error logging out", error)
    } finally {
      logout()
      navigate("/")
    }
  }

  return (
    <header className="border-b">
      <div className="flex min-h-16 items-center gap-4 px-6">
        <Link
          to="/"
          aria-label="Kogei home"
          className="inline-flex h-12 items-center px-1"
        >
          <img
            src="/kogei-final.svg"
            alt="Kogei"
            className="h-7 w-auto"
            loading="eager"
            decoding="async"
          />
        </Link>

        {isAuthPage ? null : (
          <HeaderSearch
            key={`${location.pathname}:${location.search}`}
            initialSearchQuery={initialSearchQuery}
          />
        )}

        <div className="ml-auto flex items-center gap-4">
          {isAuthPage ? null : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      className="inline-flex h-10 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                      aria-label="Currency and shipping region"
                    />
                  }
                >
                  <span aria-hidden="true">🇨🇦</span>
                  <span>CAD $</span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  We currently ship only within Canada.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {isAuthenticated ? (
            <>
              {isAuthPage ? null : (
                <>
                  <Link
                    aria-disabled={likedCount === 0}
                    aria-label="Liked arts"
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-transform duration-150 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      likedCount > 0
                        ? "animate-heart-pop hover:scale-105"
                        : "pointer-events-none text-muted-foreground opacity-50"
                    )}
                    tabIndex={likedCount > 0 ? undefined : -1}
                    to="/liked-arts"
                  >
                    <HeartIcon
                      aria-hidden="true"
                      className="size-5"
                      fill="none"
                    />
                  </Link>
                  <Button
                    aria-label={cartLabel}
                    className="relative"
                    nativeButton={false}
                    render={<Link to="/cart" />}
                    size="icon-lg"
                    variant="ghost"
                  >
                    <ShoppingBagIcon aria-hidden="true" className="size-5" />
                    {itemCount > 0 ? (
                      <span className="absolute top-0 right-0 flex size-4 items-center justify-center rounded-full bg-primary text-[0.625rem] leading-none font-medium text-primary-foreground">
                        {itemCount}
                      </span>
                    ) : null}
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      aria-label="User menu"
                      size="icon-lg"
                      variant="ghost"
                    />
                  }
                >
                  <Avatar size="lg">
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <span className="block text-sm font-medium text-foreground">
                        {user?.firstName || "Account"}
                      </span>
                      {user?.email ? (
                        <span className="block truncate text-xs">
                          {user.email}
                        </span>
                      ) : null}
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOutIcon data-icon="inline-start" aria-hidden="true" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : isLoginPage ? (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Don't have an account?</span>
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link to="/signup" />}
              >
                Sign Up
              </Button>
            </div>
          ) : isSignupPage ? (
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link to="/login" />}
            >
              Log In
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link to="/login" />}
              >
                Log In
              </Button>
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link to="/signup" />}
              >
                Sign Up
              </Button>
              <Button
                aria-label={cartLabel}
                className="relative"
                nativeButton={false}
                render={<Link to="/cart" />}
                size="icon-lg"
                variant="ghost"
              >
                <ShoppingBagIcon aria-hidden="true" className="size-5" />
                {itemCount > 0 ? (
                  <span className="absolute top-0 right-0 flex size-4 items-center justify-center rounded-full bg-primary text-[0.625rem] leading-none font-medium text-primary-foreground">
                    {itemCount}
                  </span>
                ) : null}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
