import { ImageIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { useCart } from "@/contexts/cart-context"

const canadianProvinces = [
  ["AB", "Alberta"],
  ["BC", "British Columbia"],
  ["MB", "Manitoba"],
  ["NB", "New Brunswick"],
  ["NL", "Newfoundland and Labrador"],
  ["NS", "Nova Scotia"],
  ["NT", "Northwest Territories"],
  ["NU", "Nunavut"],
  ["ON", "Ontario"],
  ["PE", "Prince Edward Island"],
  ["QC", "Quebec"],
  ["SK", "Saskatchewan"],
  ["YT", "Yukon"],
]

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
  const { itemCount, items, totalPrice } = useCart()
  const currency = items[0]?.product.currency || "USD"
  const formattedTotal = formatCurrency(totalPrice, currency)

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
            Enter your details below. Payment will be added in the next step.
          </p>
        </div>

        <div className="border p-6">
          <h2 className="mb-6 text-2xl font-medium">Contact</h2>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="checkout-email">Email</FieldLabel>
              <Input id="checkout-email" name="email" type="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-phone">Phone</FieldLabel>
              <Input id="checkout-phone" name="phone" type="tel" />
            </Field>
          </FieldGroup>
        </div>

        <div className="border p-6">
          <h2 className="mb-6 text-2xl font-medium">Shipping address</h2>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="checkout-first-name">
                  First name
                </FieldLabel>
                <Input id="checkout-first-name" name="firstName" />
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-last-name">Last name</FieldLabel>
                <Input id="checkout-last-name" name="lastName" />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="checkout-address">Address</FieldLabel>
              <Input id="checkout-address" name="address" />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="checkout-city">City</FieldLabel>
                <Input id="checkout-city" name="city" />
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-province">Province</FieldLabel>
                <NativeSelect
                  id="checkout-province"
                  name="province"
                  defaultValue="ON"
                >
                  {canadianProvinces.map(([value, label]) => (
                    <NativeSelectOption key={value} value={value}>
                      {label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-postal-code">
                  Postal code
                </FieldLabel>
                <Input id="checkout-postal-code" name="postalCode" />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="checkout-country">Country</FieldLabel>
              <Input
                id="checkout-country"
                name="country"
                value="Canada"
                readOnly
                disabled
              />
            </Field>
          </FieldGroup>
        </div>
      </section>

      <aside className="flex h-fit flex-col gap-6 border p-6">
        <h2 className="text-2xl font-medium">Order Summary</h2>
        <div className="flex flex-col divide-y">
          {items.map((item) => {
            const imageUrl =
              item.product.thumbnail_url || item.product.image_url

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
            <dt className="text-muted-foreground">Shipping & Handling</dt>
            <dd>$0.00</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Estimated GST/HST</dt>
            <dd>$0.00</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Estimated PST/RST/QST</dt>
            <dd>$0.00</dd>
          </div>
          <div className="flex justify-between gap-4 border-t pt-3 text-base font-medium">
            <dt>Order Total</dt>
            <dd>{formattedTotal}</dd>
          </div>
        </dl>
        <Button disabled>Payment coming soon</Button>
      </aside>
    </main>
  )
}
