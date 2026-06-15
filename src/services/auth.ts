import { AxiosError } from "axios"

import { type AuthUser } from "@/contexts/auth"
import { apiWithoutToken } from "@/services/axios-api"

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = LoginPayload & {
  first_name: string
  last_name: string
}

type AuthResponse = {
  data?: {
    token?: string
    access_token?: string
    user?: ApiAuthUser
    role?: string
  }
  token?: string
  access_token?: string
  user?: ApiAuthUser
  role?: string
  message?: string
}

type ApiAuthUser = {
  email?: string
  first_name?: string
  firstName?: string
  last_name?: string
  lastName?: string
  name?: string
  role?: string
  roles?: string[]
}

function normalizeRole(role?: string) {
  return role?.toLowerCase()
}

export async function login(payload: LoginPayload) {
  const response = await apiWithoutToken.post<AuthResponse>(
    "/api/auth/login",
    payload
  )

  return response.data
}

export async function register(payload: RegisterPayload) {
  const response = await apiWithoutToken.post<AuthResponse>(
    "/api/auth/register",
    payload
  )

  return response.data
}

export async function logout(token: string) {
  await apiWithoutToken.post(
    "/api/auth/logout",
    {},
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined
  )
}

export function getAuthToken(response: AuthResponse) {
  return (
    response.token ||
    response.access_token ||
    response.data?.token ||
    response.data?.access_token ||
    ""
  )
}

export function getAuthUser(
  response: AuthResponse,
  fallback: AuthUser
): AuthUser {
  const responseUser = response.user || response.data?.user

  if (!responseUser) {
    return {
      ...fallback,
      role: normalizeRole(response.role || response.data?.role || fallback.role),
    }
  }

  return {
    email: responseUser.email || fallback.email,
    firstName:
      responseUser.firstName ||
      responseUser.first_name ||
      responseUser.name ||
      fallback.firstName,
    lastName: responseUser.lastName || responseUser.last_name || fallback.lastName,
    role: normalizeRole(
      responseUser.role ||
        responseUser.roles?.[0] ||
        response.role ||
        response.data?.role ||
        fallback.role
    ),
  }
}

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data

    if (
      responseData &&
      typeof responseData === "object" &&
      "message" in responseData &&
      typeof responseData.message === "string"
    ) {
      return responseData.message
    }
  }

  return "Something went wrong. Please try again."
}
