import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/auth.service'
import { setAccessToken } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    try {
      const { data } = await authService.refresh()
      setAccessToken(data.data.accessToken)
      setUser(data.data.user)
      return data.data.user
    } catch {
      setAccessToken(null)
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    refreshSession().finally(() => setIsLoading(false))
  }, [refreshSession])

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password })
    setAccessToken(data.data.accessToken)
    setUser(data.data.user)
    return data.data.user
  }

  const register = async (payload) => {
    const { data } = await authService.register(payload)
    return data
  }

  const logout = async () => {
    await authService.logout()
    setAccessToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      isAdmin: Boolean(user && user.role === 'admin'),
      setUser,
      login,
      logout,
      register,
      refreshSession,
    }),
    [user, isLoading, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
