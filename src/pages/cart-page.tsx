import { ImageIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { featuredStories, getArtworkSlug } from "@/data/artworks"

export function CartPage() {
  const cartItems = featuredStories.slice(0, 3).map((artwork, index) => ({
    ...artwork,
    quantity: index === 0 ? 1 : 2,
  }))
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price.replace("$", "")) * item.quantity,
    0
  )

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-medium">Cart</h1>
          <p className="text-sm text-muted-foreground">
            Review mock artwork selections before checkout.
          </p>
        </div>

        <div className="flex flex-col divide-y border-y">
          {cartItems.map((item) => (
            <article
              key={item.title}
              className="grid gap-5 py-6 md:grid-cols-[12rem_1fr_auto]"
            >
              <Link
                to={`/art/${getArtworkSlug(item)}`}
                className={`flex aspect-[4/3] items-center justify-center rounded-2xl border ${item.surface}`}
              >
                <ImageIcon aria-hidden="true" />
              </Link>

              <div className="flex flex-col gap-2">
                <Link to={`/art/${getArtworkSlug(item)}`}>
                  <h2 className="text-xl font-medium">{item.title}</h2>
                </Link>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="flex flex-row items-start justify-between gap-4 md:flex-col md:items-end">
                <p className="font-medium">{item.price}</p>
                <Button variant="ghost">Remove</Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="flex h-fit flex-col gap-6 border p-6">
        <h2 className="text-2xl font-medium">Order Summary</h2>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Items</dt>
            <dd>{cartItems.length}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>${subtotal}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Estimated fees</dt>
            <dd>$0</dd>
          </div>
          <div className="flex justify-between gap-4 border-t pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd>${subtotal}</dd>
          </div>
        </dl>
        <Button>Checkout</Button>
        <Button variant="outline" nativeButton={false} render={<Link to="/" />}>
          Continue shopping
        </Button>
      </aside>
    </main>
  )
}
