import { type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/pages/auth-layout"

export function LoginPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <AuthLayout
      title="Log In"
      description="Access your account to manage saved AI artworks."
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="login-email">Email</FieldLabel>
            <Input
              autoComplete="email"
              id="login-email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
            <Input
              autoComplete="current-password"
              id="login-password"
              name="password"
              type="password"
            />
          </Field>
        </FieldGroup>
        <Button type="submit">Log In</Button>
      </form>
    </AuthLayout>
  )
}
