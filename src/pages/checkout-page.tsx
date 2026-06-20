import { ImageIcon } from "lucide-react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth"
import { useCart } from "@/contexts/cart-context"
import { getCartItemVariant } from "@/lib/products"
import { createStripeCheckoutSession } from "@/services/cart"

function formatCurrency(value: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value)
  } catch {
    return `${currency} ${value}`
  }
}

export function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { isLoading, itemCount, items, totalPrice } = useCart()
  const [isRedirectingToCheckout, setIsRedirectingToCheckout] = useState(false)
  const [checkoutStatus, setCheckoutStatus] = useState("")
  const currency = items[0]?.product.currency || "USD"
  const formattedTotal = formatCurrency(totalPrice, currency)

  async function handleCheckout() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } })
      return
    }

    if (isLoading) {
      return
    }

    try {
      setIsRedirectingToCheckout(true)
      setCheckoutStatus("")

      const session = await createStripeCheckoutSession()

      if (!session.checkout_url) {
        throw new Error("Checkout URL was not returned.")
      }

      window.location.href = session.checkout_url
    } catch (error) {
      console.error("Error creating checkout session", error)
      setCheckoutStatus("Checkout could not be started.")
    } finally {
      setIsRedirectingToCheckout(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center gap-4 px-6 py-14 text-center">
        <h1 className="text-3xl font-medium">Your cart is empty</h1>
        <Button nativeButton={false} render={<Link to="/" />}>
          Continue shopping
        </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_26rem]">
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-medium">Checkout</h1>
          <p className="text-sm text-muted-foreground">
            Review your order. Contact, shipping, tax, and payment details are
            handled securely by Stripe.
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="flex flex-col gap-4 border p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-medium">Sign in to continue</h2>
              <p className="text-sm text-muted-foreground">
                Create an account or log in to complete checkout.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                nativeButton={false}
                render={<Link to="/login" state={{ from: location }} />}
              >
                Log in
              </Button>
              <Button
                nativeButton={false}
                render={<Link to="/signup" state={{ from: location }} />}
                variant="outline"
              >
                Sign up
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 border p-6">
          <h2 className="text-2xl font-medium">Next step</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Stripe Checkout will collect your contact and shipping details, then
            calculate the final tax and total before payment.
          </p>
        </div>
      </section>

      <aside className="flex h-fit flex-col gap-6 border p-6">
        <h2 className="text-2xl font-medium">Order Summary</h2>
        <div className="flex flex-col divide-y">
          {items.map((item) => {
            const imageUrl =
              item.product.thumbnail_url || item.product.image_url
            const variant = getCartItemVariant(item)
            const variantLabel = variant?.size || ""
            const unitPrice = variant?.price

            return (
              <div key={item.id} className="flex gap-4 py-4 first:pt-0">
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product.title}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  ) : (
                    <ImageIcon aria-hidden="true" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="font-medium">{item.product.title}</p>
                  {variantLabel ? (
                    <p className="text-sm text-muted-foreground">
                      Size: {variantLabel}
                    </p>
                  ) : null}
                  {variant && unitPrice !== undefined ? (
                    <p className="text-sm text-muted-foreground">
                      Unit price: {formatCurrency(unitPrice, currency)}
                    </p>
                  ) : null}
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm">
                    {formatCurrency(item.subtotal, currency)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        <dl className="flex flex-col gap-3 border-t pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Items</dt>
            <dd>{itemCount}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formattedTotal}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd>Calculated in Stripe</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Tax</dt>
            <dd>Calculated in Stripe</dd>
          </div>
          <div className="flex justify-between gap-4 border-t pt-3 text-base font-medium">
            <dt>Order Total</dt>
            <dd>{formattedTotal}</dd>
          </div>
        </dl>
        <Button
          onClick={handleCheckout}
          disabled={isRedirectingToCheckout || isLoading}
        >
          {isLoading
            ? "Preparing checkout..."
            : isRedirectingToCheckout
              ? "Redirecting..."
              : "Pay with Stripe"}
        </Button>
        {checkoutStatus ? (
          <p className="text-sm text-muted-foreground">{checkoutStatus}</p>
        ) : null}
      </aside>
    </main>
  )
}
