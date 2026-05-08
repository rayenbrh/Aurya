import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

let accessToken = null
export const setAccessToken = (token) => {
  accessToken = token
}
export const getAccessToken = () => accessToken

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (!original || original.__isRetry) return Promise.reject(error)
    if (error.response?.status !== 401) return Promise.reject(error)
    if (original.url?.includes('/auth/refresh') || original.url?.includes('/auth/login')) {
      return Promise.reject(error)
    }
    original.__isRetry = true
    try {
      const { data } = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true })
      const token = data?.data?.accessToken
      if (token) {
        setAccessToken(token)
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      }
    } catch {
      setAccessToken(null)
    }
    return Promise.reject(error)
  },
)

export default api
