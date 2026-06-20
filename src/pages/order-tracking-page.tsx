import { type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { trackOrder, type Order } from "@/services/orders"

function formatOrderTotal(order: Order) {
  return `${order.currency} ${order.total_amount}`
}

export function OrderTrackingPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    try {
      setIsSubmitting(true)
      setStatus("")
      setOrder(null)

      const nextOrder = await trackOrder({
        order_number: String(formData.get("orderNumber") || ""),
        email: String(formData.get("email") || ""),
      })

      setOrder(nextOrder)
    } catch (error) {
      console.error("Error tracking order", error)
      setStatus("Order could not be found. Check the details and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
      <section className="flex flex-col gap-5">
        <h1 className="text-4xl font-medium">Order Status</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Enter your order number and email address to view the latest order
          status. No account login is required.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <form
          className="flex flex-col gap-6 border p-6"
          onSubmit={handleSubmit}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="track-order-number">Order number</FieldLabel>
              <Input
                id="track-order-number"
                name="orderNumber"
                placeholder="ORD-20260620-ABC123"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="track-email">Email</FieldLabel>
              <Input id="track-email" name="email" required type="email" />
            </Field>
          </FieldGroup>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Checking..." : "Track order"}
            </Button>
            {status ? (
              <p className="text-sm text-muted-foreground">{status}</p>
            ) : null}
          </div>
        </form>

        {order ? (
          <div className="flex flex-col gap-3 border p-6 text-sm">
            <p className="text-lg font-medium">Order found</p>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Order number</span>
              <span className="font-medium">{order.order_number}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium">{order.status}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-medium">{order.payment_status}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{formatOrderTotal(order)}</span>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}
