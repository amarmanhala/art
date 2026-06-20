import { type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { sendContactMessage } from "@/services/contact"

export function ContactPage() {
  const [status, setStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    try {
      setIsSubmitting(true)
      setStatus("")
      await sendContactMessage({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        order_number: String(formData.get("orderNumber") || ""),
        message: String(formData.get("message") || ""),
      })
      setStatus("Thanks. We received your message.")
      event.currentTarget.reset()
    } catch (error) {
      console.error("Error sending contact message", error)
      setStatus("Message could not be sent. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
      <section className="flex flex-col gap-5">
        <h1 className="text-4xl font-medium">Contact</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Questions about an order, return, artwork, or custom request? Send us
          a message and our support team will get back to you.
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Email</span>
          <a href="mailto:hello@kogei.art">hello@kogei.art</a>
        </div>
      </section>

      <section className="border p-6">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="contact-name">Name</FieldLabel>
              <Input id="contact-name" name="name" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-email">Email</FieldLabel>
              <Input id="contact-email" name="email" type="email" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-order">Order number</FieldLabel>
              <Input
                id="contact-order"
                name="orderNumber"
                placeholder="Optional"
              />
              <FieldDescription>
                Include this if your message is about an existing order.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-message">Message</FieldLabel>
              <Textarea
                id="contact-message"
                name="message"
                className="min-h-40 resize-y"
                required
              />
            </Field>
          </FieldGroup>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send message"}
            </Button>
            {status ? (
              <p className="text-sm text-muted-foreground">{status}</p>
            ) : null}
          </div>
        </form>
      </section>
    </main>
  )
}
