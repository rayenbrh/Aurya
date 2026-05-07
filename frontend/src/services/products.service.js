import api from './api'

export const productsService = {
  getProducts: (params) => api.get('/products', { params }),
  getCategories: () => api.get('/products/categories/all'),
  getProduct: (slug) => api.get(`/products/${slug}`),
}
