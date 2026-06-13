import { type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/pages/auth-layout"

export function SignupPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <AuthLayout
      title="Sign Up"
      description="Create an account to buy and collect AI generated art."
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="signup-first-name">First name</FieldLabel>
            <Input
              autoComplete="given-name"
              id="signup-first-name"
              name="firstName"
              type="text"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-last-name">Last name</FieldLabel>
            <Input
              autoComplete="family-name"
              id="signup-last-name"
              name="lastName"
              type="text"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-email">Email</FieldLabel>
            <Input
              autoComplete="email"
              id="signup-email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-password">Password</FieldLabel>
            <Input
              autoComplete="new-password"
              id="signup-password"
              name="password"
              type="password"
            />
            <FieldDescription>
              Use at least 8 characters for the mock account.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <Button type="submit">Create Account</Button>
      </form>
    </AuthLayout>
  )
}
