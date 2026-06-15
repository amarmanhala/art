import { type ReactNode, useEffect, useMemo, useState } from "react"

import {
  AuthContext,
  type AuthContextValue,
  type AuthUser,
  authTokenKey,
  authUserKey,
} from "@/contexts/auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem(authTokenKey) || "")
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem(authUserKey)

    if (!storedUser) {
      return null
    }

    try {
      return JSON.parse(storedUser) as AuthUser
    } catch {
      localStorage.removeItem(authUserKey)
      return null
    }
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem(authTokenKey, token)
    } else {
      localStorage.removeItem(authTokenKey)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(authUserKey, JSON.stringify(user))
    } else {
      localStorage.removeItem(authUserKey)
    }
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "admin",
      token,
      user,
      login(nextToken, nextUser) {
        setToken(nextToken)
        setUser(nextUser)
      },
      logout() {
        setToken("")
        setUser(null)
      },
    }),
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
