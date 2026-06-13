import axios from "axios"

const apiWithoutToken = axios.create({
  baseURL: "",
})

export { apiWithoutToken }
