import { apiWithToken } from "@/services/axios-api"

type CreateCarouselUploadSASResponse = {
  data: {
    upload_url: string
    blob_name: string
    image_url: string
    expires_at: string
  }
}

type UploadSAS = CreateCarouselUploadSASResponse["data"]

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])

type CreateProductUploadSASResponse = {
  data: {
    files?: UploadSAS[]
    uploads?: UploadSAS[]
  } | UploadSAS[]
}

type CreateStyleUploadSASResponse = {
  data: UploadSAS
}

async function uploadFileToSAS(uploadUrl: string, file: File) {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images can be uploaded.")
  }

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.type,
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error("Image could not be uploaded.")
  }
}

export async function uploadCarouselImage(file: File) {
  const response = await apiWithToken.post<CreateCarouselUploadSASResponse>(
    "/api/uploads/carousel/sas",
    {
      file_name: file.name,
      content_type: file.type,
    }
  )

  const upload = response.data.data

  await uploadFileToSAS(upload.upload_url, file)

  return upload
}

export async function uploadProductImages(files: File[]) {
  const response = await apiWithToken.post<CreateProductUploadSASResponse>(
    "/api/admin/products/images/sas",
    {
      files: files.map((file) => ({
        file_name: file.name,
        content_type: file.type,
      })),
    }
  )

  const uploads = Array.isArray(response.data.data)
    ? response.data.data
    : response.data.data.files || response.data.data.uploads || []

  if (uploads.length !== files.length) {
    throw new Error("Product image upload URLs could not be created.")
  }

  await Promise.all(
    uploads.map((upload, index) => {
      const file = files[index]

      return uploadFileToSAS(upload.upload_url, file)
    })
  )

  return uploads
}

export async function uploadStyleImage(file: File) {
  const response = await apiWithToken.post<CreateStyleUploadSASResponse>(
    "/api/styles/images/sas",
    {
      file_name: file.name,
      content_type: file.type,
    }
  )

  const upload = response.data.data

  await uploadFileToSAS(upload.upload_url, file)

  return upload
}
