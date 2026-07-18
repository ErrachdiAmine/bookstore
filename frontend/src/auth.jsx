import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const API_LINK = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const endpoint = (path) => `${API_LINK}${path}`

const responseError = (error) => error.response?.data || { detail: 'Unable to reach the server.' }

export const registerUser = async (firstname, lastname, username, email, password, confirmPassword, address) => {
  try {
    const response = await axios.post(endpoint('/api/auth/signup/'), {
      first_name: firstname, last_name: lastname, username, email, password, confirmPassword, address,
    })
    return response.data
  } catch (error) {
    throw responseError(error)
  }
}

export const loginUser = async (identifier, password) => {
  const credential = identifier.trim()
  const payload = credential.includes('@') ? { email: credential, password } : { username: credential, password }
  try {
    const response = await axios.post(endpoint('/api/auth/token/'), payload)
    const { access, refresh } = response.data
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
    localStorage.setItem('expires-at', jwtDecode(access).exp * 1000)
    if (response.data.user) localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  } catch (error) {
    throw responseError(error)
  }
}

export const getCurrentUser = () => {
  const access = localStorage.getItem('access') || localStorage.getItem('access_token')
  if (!access) return null
  try {
    const { exp, username } = jwtDecode(access)
    if (exp && exp * 1000 <= Date.now()) {
      logoutUser()
      return null
    }
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null')
    return savedUser || (username ? { username } : { username: 'Account' })
  } catch {
    logoutUser()
    return null
  }
}

export const logoutUser = () => {
  ;['access', 'refresh', 'access_token', 'refresh_token', 'expires-at', 'user', 'logged'].forEach(key => localStorage.removeItem(key))
}
