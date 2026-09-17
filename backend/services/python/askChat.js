import axios from 'axios'

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

export const askChatWithPython = async ({ documentId, question }) => {
  try {
    const { data } = await axios.post(
      `${process.env.PYTHON_SERVICE_URL}/chat/`,
      {
        document_id: documentId,
        question,
      },
      {
        timeout: 120000,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    return {
      answer: data.answer,
    }
  } catch (error) {
    const serviceError = new Error(getPythonErrorMessage(error))
    serviceError.isPythonServiceError = true
    serviceError.statusCode = error.response?.status || 500
    throw serviceError
  }
}
