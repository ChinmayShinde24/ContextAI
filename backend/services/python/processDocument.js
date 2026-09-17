import axios from 'axios'
import fs from 'fs/promises'

const getPythonErrorMessage = (error) => {
  if (error.response) {
    const { status, data } = error.response

    if (typeof data === 'string' && data.trim()) {
      return data
    }

    if (data?.detail) {
      return typeof data.detail === 'string'
        ? data.detail
        : JSON.stringify(data.detail)
    }

    if (data?.message) {
      return data.message
    }

    if (data?.error) {
      return data.error
    }

    return `Python service failed with status ${status}`
  }

  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return 'Python service is unreachable. Please ensure it is running.'
  }

  if (error.code === 'ECONNABORTED') {
    return 'Python service request timed out.'
  }

  if (error.request) {
    return 'No response received from Python service.'
  }

  return error.message || 'Unexpected Python service error'
}

export const processDocumentWithPython = async ({
  filePath,
  fileName,
  mimeType,
  documentId,
}) => {
  const fileBuffer = await fs.readFile(filePath)

  const formData = new FormData()
  formData.append(
    'file',
    new Blob([fileBuffer], { type: mimeType }),
    fileName,
  )
  formData.append('document_id', documentId)

  try {
    const { data } = await axios.post(
      `${process.env.PYTHON_SERVICE_URL}/documents/process`,
      formData,
      {
        timeout: 120000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      },
    )

    return {
      pageCount: data.page_count ?? 0,
      chunkCount: data.chunk_count ?? 0,
      message: data.message,
      documentId: data.document_id,
      fileName: data.file_name,
    }
  } catch (error) {
    const serviceError = new Error(getPythonErrorMessage(error))
    serviceError.isPythonServiceError = true
    serviceError.statusCode = error.response?.status || 500
    throw serviceError
  }
}
