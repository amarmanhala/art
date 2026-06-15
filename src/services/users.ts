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

export async function getAdminUsers() {
  const response =
    await apiWithToken.get<AdminUsersResponse>("/api/admin/users")
  const data = response.data.data

  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.content)) {
    return data.content
  }

  if (Array.isArray(data?.users)) {
    return data.users
  }

  return response.data.users ?? []
}
