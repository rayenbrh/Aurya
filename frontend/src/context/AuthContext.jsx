import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/auth.service'
import { setAccessToken } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authService
      .refresh()
      .then(({ data }) => {
        setAccessToken(data.data.accessToken)
        setUser(data.data.user)
      })
      .catch(() => {
        setAccessToken(null)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password })
    setAccessToken(data.data.accessToken)
    setUser(data.data.user)
    return data.data.user
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
    }),
    [user, isLoading],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
