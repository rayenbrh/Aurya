import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const RequireAuth = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="grid min-h-screen place-items-center">Chargement...</div>
  if (!isAuthenticated) return <Navigate to="/connexion" replace />
  return children
}

export default RequireAuth
