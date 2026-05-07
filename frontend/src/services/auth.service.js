import api from './api'

export const authService = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  refresh: () => api.post('/auth/refresh'),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}
