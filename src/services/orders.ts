import { apiWithToken, apiWithoutToken } from "@/services/axios-api"

export type OrderItem = {
  id?: number
  product_title?: string
  quantity?: number
  subtotal?: number
}

export type Order = {
  id: number
  order_number: string
  status: string
  payment_status: string
  currency: string
  subtotal: number
  tax_amount: number
  shipping_amount: number
  total_amount: number
  customer_email?: string
  shipping_name?: string
  shipping_city?: string
  shipping_state?: string
  shipping_postal_code?: string
  shipping_country?: string
  created_at?: string
  updated_at?: string
  items?: OrderItem[]
}

type OrderResponse = {
  data: Order
}

type OrdersResponse = {
  data: Order[] | { content?: Order[] }
}

export async function getOrders() {
  const response = await apiWithToken.get<OrdersResponse>("/api/orders")
  const data = response.data.data

  return Array.isArray(data) ? data : (data.content ?? [])
}

export async function getOrder(id: number) {
  const response = await apiWithToken.get<OrderResponse>(`/api/orders/${id}`)

  return response.data.data
}

export async function getOrderBySession(sessionId: string) {
  const response = await apiWithToken.get<OrderResponse>(
    `/api/orders/by-session/${sessionId}`
  )

  return response.data.data
}

export async function trackOrder(payload: {
  order_number: string
  email: string
}) {
  const response = await apiWithoutToken.post<OrderResponse>(
    "/api/orders/track",
    payload
  )

  return response.data.data
}
