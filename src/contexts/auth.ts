import { createContext, useContext } from "react"

export type AuthUser = {
  email: string
  firstName?: string
  lastName?: string
  role?: string
}

export type AuthContextValue = {
  isAuthenticated: boolean
  isAdmin: boolean
  token: string
  user: AuthUser | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

export const authTokenKey = "auth_token"
export const authUserKey = "auth_user"
export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
