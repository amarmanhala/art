import axios from "axios"

import { apiWithoutToken } from "@/services/axios-api"

type CreateCarouselUploadSASResponse = {
  data: {
    upload_url: string
    blob_name: string
    image_url: string
    expires_at: string
  }
}

export async function uploadCarouselImage(file: File) {
  const response = await apiWithoutToken.post<CreateCarouselUploadSASResponse>(
    "/api/uploads/carousel/sas",
    {
      file_name: file.name,
      content_type: file.type,
    }
  )

  const upload = response.data.data

  await axios.put(upload.upload_url, file, {
    headers: {
      "Content-Type": file.type,
      "x-ms-blob-type": "BlockBlob",
      "x-ms-blob-content-type": file.type,
    },
  })

  return upload
}
