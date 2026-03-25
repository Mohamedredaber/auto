import axios from 'axios'

const api = axios.create({
  baseURL: '/api',          // ✅ مع Proxy — بلا localhost
  withCredentials: true,    // ✅ مهم للكوكي
  headers: {
    'Accept':       'application/json',
    'Content-Type': 'application/json',
  }
})

// CSRF — بلا /api لأنو /sanctum مو /api
export const getCsrfToken = () =>
  axios.get('/sanctum/csrf-cookie', {
    withCredentials: true
  })

// Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error)
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api