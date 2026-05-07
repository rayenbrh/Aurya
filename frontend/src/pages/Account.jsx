import { Navigate } from 'react-router-dom'
import PageTransition from '../components/ui/PageTransition'
import { useAuth } from '../context/AuthContext'

const Account = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/connexion" replace />
  return (
    <PageTransition>
      <main className="grid min-h-screen place-items-center px-5 pt-20">
        <div className="w-full max-w-xl border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-8">
          <p className="eyebrow">Mon compte</p>
          <h1 className="mt-4 font-cormorant text-5xl font-light">Bienvenue {user.firstName} {user.lastName}</h1>
          <p className="mt-3 text-[rgba(255,255,255,0.45)]">{user.email}</p>
        </div>
      </main>
    </PageTransition>
  )
}

export default Account
