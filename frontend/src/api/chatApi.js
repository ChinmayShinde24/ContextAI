import axios from 'axios'
import { API_BASE_URL } from './config'

const getAuthHeaders = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    return { Authorization: `Bearer ${user.token}` }
  }
  return {}
}

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

  return 'Failed to get chat answer'
}

export const askQuestion = async ({ documentId, question, sessionId }) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/api/chat`,
      {
        documentId,
        question,
        sessionId,
      },
      {
        timeout: 120000,
        headers: getAuthHeaders(),
      },
    )

    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const fetchChatSessions = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/chat/sessions`, {
      headers: getAuthHeaders(),
    })
    return data.sessions || []
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const fetchChatSessionById = async (sessionId) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/chat/sessions/${sessionId}`, {
      headers: getAuthHeaders()
    })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const createChatSession = async ({ title, documentId }) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/api/chat/sessions`, {
      title,
      documentId
    }, {
      headers: getAuthHeaders()
    })
    return data.session
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
