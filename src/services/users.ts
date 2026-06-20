import { AxiosError } from "axios"

import { apiWithToken } from "@/services/axios-api"

export type AdminUser = {
  id: number | string
  email: string
  first_name?: string
  firstName?: string
  last_name?: string
  lastName?: string
  name?: string
  role?: string
  created_at?: string
  createdAt?: string
  updated_at?: string
  updatedAt?: string
}

type AdminUsersResponse = {
  data?: AdminUser[] | { content?: AdminUser[]; users?: AdminUser[] }
  users?: AdminUser[]
}

function normalizeUsersResponse(response: AdminUsersResponse) {
  const data = response.data

  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.content)) {
    return data.content
  }

  if (Array.isArray(data?.users)) {
    return data.users
  }

  return response.users ?? []
}

async function requestAdminUsers(endpoint: string) {
  const response = await apiWithToken.get<AdminUsersResponse>(endpoint)

  return normalizeUsersResponse(response.data)
}

export async function getAdminUsers() {
  try {
    return await requestAdminUsers("/api/admin/users")
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return requestAdminUsers("/api/users")
    }

    throw error
  }
}
