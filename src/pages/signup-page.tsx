import { type FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth"
import { AuthLayout } from "@/pages/auth-layout"
import {
  getAuthErrorMessage,
  getAuthToken,
  getAuthUser,
  register,
} from "@/services/auth"

export function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    const firstName = String(formData.get("firstName") || "")
    const lastName = String(formData.get("lastName") || "")
    const email = String(formData.get("email") || "")

    try {
      const response = await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password: String(formData.get("password") || ""),
      })
      const token = getAuthToken(response)

      if (token) {
        login(
          token,
          getAuthUser(response, {
            email,
            firstName,
            lastName,
          })
        )
        navigate("/")
      } else {
        navigate("/login")
      }
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
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
              className="h-11 px-3"
              id="signup-first-name"
              name="firstName"
              required
              type="text"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-last-name">Last name</FieldLabel>
            <Input
              autoComplete="family-name"
              className="h-11 px-3"
              id="signup-last-name"
              name="lastName"
              required
              type="text"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-email">Email</FieldLabel>
            <Input
              autoComplete="email"
              className="h-11 px-3"
              id="signup-email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-password">Password</FieldLabel>
            <Input
              autoComplete="new-password"
              className="h-11 px-3"
              id="signup-password"
              name="password"
              required
              type="password"
            />
            <FieldDescription>
              Use at least 8 characters for the mock account.
            </FieldDescription>
          </Field>
        </FieldGroup>
        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}
        <Button disabled={isSubmitting} size="lg" type="submit">
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthLayout>
  )
}
