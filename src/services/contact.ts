import { apiWithoutToken } from "@/services/axios-api"

export type ContactPayload = {
  name: string
  email: string
  order_number: string
  message: string
}

export async function sendContactMessage(payload: ContactPayload) {
  await apiWithoutToken.post("/api/contact", payload)
}
