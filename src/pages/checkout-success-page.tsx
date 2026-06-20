import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { getOrderBySession, type Order } from "@/services/orders"

function formatOrderTotal(order: Order) {
  return `${order.currency} ${order.total_amount}`
}

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState(
    sessionId ? "Loading order..." : "Checkout session was not found."
  )

  useEffect(() => {
    let shouldIgnore = false

    async function loadOrder() {
      if (!sessionId) {
        return
      }

      try {
        setStatus("Loading order...")
        const nextOrder = await getOrderBySession(sessionId)

        if (!shouldIgnore) {
          setOrder(nextOrder)
          setStatus("")
        }
      } catch (error) {
        console.error("Error loading order by checkout session", error)

        if (!shouldIgnore) {
          setStatus("Order could not be loaded yet. Please try again shortly.")
        }
      }
    }

    void loadOrder()

    return () => {
      shouldIgnore = true
    }
  }, [sessionId])

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center gap-4 px-6 py-14 text-center">
      {order ? (
        <>
          <h1 className="text-3xl font-medium">Order placed successfully</h1>
          <div className="flex flex-col gap-2 text-muted-foreground">
            <p>Order number: {order.order_number}</p>
            <p>Status: {order.status}</p>
            <p>Total: {formatOrderTotal(order)}</p>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-medium">Checkout complete</h1>
          <p className="max-w-xl text-muted-foreground">{status}</p>
        </>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        <Button nativeButton={false} render={<Link to="/order-status" />}>
          Track order
        </Button>
        <Button
          nativeButton={false}
          render={<Link to="/art" />}
          variant="outline"
        >
          Continue shopping
        </Button>
      </div>
    </main>
  )
}
