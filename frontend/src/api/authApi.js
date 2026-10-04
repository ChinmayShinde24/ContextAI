import axios from 'axios'
import { API_BASE_URL } from './config'

export const loginUser = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    })
    return data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Failed to login. Please try again.')
  }
}

export const signupUser = async (name, email, password) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
      name,
      email,
      password,
    })
    return data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Failed to sign up. Please try again.')
  }
}
