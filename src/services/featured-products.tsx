import { apiWithoutToken } from "./axios-api"
import { type Product } from "@/types/product"

type FeaturedProductsResponse = {
  data: {
    content: Product[]
  }
}

async function getFeaturedProducts() {
  try {
    const response =
      await apiWithoutToken.get<FeaturedProductsResponse>("/api/products")
    return response.data.data.content
  } catch (err) {
    console.error("Error fetching featured products", err)
    return []
  }
}

export default getFeaturedProducts
