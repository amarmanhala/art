import { ImageIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"

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

export function CartPage() {
  const { itemCount, items, isLoading, removeItem, totalPrice } = useCart()
  const currency = items[0]?.product.currency || "USD"
  const formattedSubtotal = formatCurrency(totalPrice, currency)

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-medium">Cart</h1>
        </div>

        {isLoading ? (
          <div className="min-h-60 rounded-2xl border bg-muted/40" />
        ) : items.length > 0 ? (
          <div className="flex flex-col divide-y border-y">
            {items.map((item) => {
              const productUrl = `/art/${item.product.slug || item.product.id}`
              const imageUrl =
                item.product.thumbnail_url || item.product.image_url

              return (
                <article
                  key={item.id}
                  className="grid gap-5 py-6 md:grid-cols-[12rem_1fr_auto]"
                >
                  <Link
                    to={productUrl}
                    className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border bg-muted"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.product.title}
                        className="size-full object-cover"
                      />
                    ) : (
                      <ImageIcon aria-hidden="true" />
                    )}
                  </Link>

                  <div className="flex flex-col gap-2">
                    <Link to={productUrl}>
                      <h2 className="text-xl font-medium">
                        {item.product.title}
                      </h2>
                    </Link>
                    {item.product.description ? (
                      <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                        {item.product.description}
                      </p>
                    ) : null}
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div className="flex flex-row items-start justify-between gap-4 md:flex-col md:items-end">
                    <p className="font-medium">
                      {formatCurrency(item.subtotal, currency)}
                    </p>
                    <Button variant="ghost" onClick={() => removeItem(item.id)}>
                      Remove
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="flex min-h-60 flex-col items-center justify-center gap-4 rounded-2xl border bg-muted/40 p-6 text-center">
            <h2 className="text-2xl font-medium">Your cart is empty</h2>
            <Button nativeButton={false} render={<Link to="/" />}>
              Continue shopping
            </Button>
          </div>
        )}
      </section>

      {items.length > 0 ? (
        <aside className="flex h-fit flex-col gap-6 border p-6">
          <h2 className="text-2xl font-medium">Order Summary</h2>
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Items</dt>
              <dd>{itemCount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formattedSubtotal}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Estimated fees</dt>
              <dd>$0.00</dd>
            </div>
            <div className="flex justify-between gap-4 border-t pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd>{formattedSubtotal}</dd>
            </div>
          </dl>
          <Button>Checkout</Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/" />}
          >
            Continue shopping
          </Button>
        </aside>
      ) : null}
    </main>
  )
}
