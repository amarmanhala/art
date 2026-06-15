import axios from "axios"

import { authTokenKey } from "@/contexts/auth"

const apiWithoutToken = axios.create({
  baseURL: "",
})

const apiWithToken = axios.create({
  baseURL: "",
})

apiWithToken.interceptors.request.use((config) => {
  const token = localStorage.getItem(authTokenKey)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export { apiWithToken, apiWithoutToken }
