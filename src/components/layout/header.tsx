import {
  ChevronRightIcon,
  ImageIcon,
  LogOutIcon,
  ShoppingCartIcon,
} from "lucide-react"
import { useState } from "react"
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
import { logout as logoutRequest } from "@/services/auth"

function getUserInitials(email: string, firstName?: string, lastName?: string) {
  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((name) => name?.charAt(0))
    .join("")

  return initials || email.charAt(0).toUpperCase() || "U"
}

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logout, token, user } = useAuth()
  const { itemCount } = useCart()
  const canSubmitSearch = searchQuery.trim().length > 0
  const isLoginPage = location.pathname === "/login"
  const isSignupPage = location.pathname === "/signup"
  const isAuthPage = isLoginPage || isSignupPage
  const userInitials = user
    ? getUserInitials(user.email, user.firstName, user.lastName)
    : "U"
  const cartLabel =
    itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"

  async function handleLogout() {
    try {
      await logoutRequest(token)
    } finally {
      logout()
      navigate("/")
    }
  }

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

        {isAuthPage ? null : (
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
                <Button
                  aria-label={cartLabel}
                  className="relative"
                  nativeButton={false}
                  render={<Link to="/cart" />}
                  size="icon-lg"
                  variant="ghost"
                >
                  <ShoppingCartIcon aria-hidden="true" />
                  {itemCount > 0 ? (
                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {itemCount}
                    </span>
                  ) : null}
                </Button>
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
                variant="outline"
              >
                <ShoppingCartIcon aria-hidden="true" />
                {itemCount > 0 ? (
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
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
