import api from './api'

export const settingsService = {
  getSettings: async () => {
    const { data } = await api.get('/settings')
    return data.data
  },
}
