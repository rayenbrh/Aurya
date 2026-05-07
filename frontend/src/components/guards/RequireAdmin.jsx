import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const RequireAdmin = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  if (isLoading) return <div className="grid min-h-screen place-items-center">Chargement...</div>
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />
  return children
}

export default RequireAdmin
