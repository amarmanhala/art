import { type FormEvent, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth"
import { AuthLayout } from "@/pages/auth-layout"
import {
  getAuthErrorMessage,
  getAuthToken,
  getAuthUser,
  login as loginRequest,
} from "@/services/auth"

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    const email = String(formData.get("email") || "")

    try {
      const response = await loginRequest({
        email,
        password: String(formData.get("password") || ""),
      })
      const token = getAuthToken(response)

      if (!token) {
        setErrorMessage("Login succeeded, but no auth token was returned.")
        return
      }

      const user = getAuthUser(response, { email })
      const redirectTo =
        location.state &&
        typeof location.state === "object" &&
        "from" in location.state &&
        location.state.from &&
        typeof location.state.from === "object" &&
        "pathname" in location.state.from &&
        typeof location.state.from.pathname === "string"
          ? location.state.from.pathname
          : "/"

      login(token, user)
      navigate(user.role === "admin" ? redirectTo : "/")
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
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
              className="h-11 px-3"
              id="login-email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
            <Input
              autoComplete="current-password"
              className="h-11 px-3"
              id="login-password"
              name="password"
              required
              type="password"
            />
          </Field>
        </FieldGroup>
        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}
        <Button disabled={isSubmitting} size="lg" type="submit">
          {isSubmitting ? "Logging in..." : "Log In"}
        </Button>
      </form>
    </AuthLayout>
  )
}
