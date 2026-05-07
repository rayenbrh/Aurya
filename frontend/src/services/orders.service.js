import api from './api'

export const ordersService = {
  createOrder: (payload) => api.post('/orders', payload),
  trackOrder: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
  myOrders: (params) => api.get('/orders/my', { params }),
}
