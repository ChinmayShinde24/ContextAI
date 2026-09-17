import axios from 'axios'
import { API_BASE_URL } from './config'

const getErrorMessage = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error
  }

  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.message) {
    return error.message
  }

  return 'Failed to upload document'
}

export const uploadDocument = async (file) => {
  const formData = new FormData()
  formData.append('pdf', file)

  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/api/documents/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 180000,
      },
    )

    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
