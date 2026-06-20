import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function CheckoutCancelPage() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center gap-4 px-6 py-14 text-center">
      <h1 className="text-3xl font-medium">Checkout canceled</h1>
      <p className="max-w-xl text-muted-foreground">
        You can return to your cart and try again when you’re ready.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button nativeButton={false} render={<Link to="/cart" />}>
          Back to cart
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link to="/checkout" />}>
          Retry checkout
        </Button>
      </div>
    </main>
  )
}
