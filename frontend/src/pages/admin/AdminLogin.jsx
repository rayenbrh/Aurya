import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true })
  }, [isAdmin, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await login(email, password)
      if (user.role !== 'admin') {
        setError('Accès réservé aux administrateurs.')
        return
      }
      navigate('/admin')
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur de connexion')
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-obsidian px-4">
      <form onSubmit={onSubmit} className="grid-pattern w-[calc(100%-32px)] max-w-[400px] border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-6 sm:p-12">
        <img src="/logo.png" alt="Aurya Deco" className="mx-auto mb-7 h-12 w-12 object-contain" />
        <h1 className="text-center font-cormorant text-[28px] italic text-gold">Administration</h1>
        <p className="mb-9 text-center font-josefin text-[9px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.45)]">AURYA DECO</p>
        <label className="mb-2 font-josefin text-[8px] uppercase tracking-[0.2em] text-gold">Email</label>
        <input className="admin-input auth-input mb-6 w-full border-0 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent py-3 text-left" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="mb-2 font-josefin text-[8px] uppercase tracking-[0.2em] text-gold">Mot de passe</label>
        <div className="relative">
          <input className="admin-input auth-input mb-6 w-full border-0 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent py-3 text-left" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-0 top-3 text-[rgba(255,255,255,0.35)] hover:text-gold">{show ? <FiEyeOff /> : <FiEye />}</button>
        </div>
        <button className="h-[50px] w-full bg-gold font-josefin text-[9px] uppercase tracking-[0.22em] text-black">Accéder →</button>
        {error ? <p className="mt-3 text-sm text-[#C0392B]">{error}</p> : null}
      </form>
      <Link to="/" className="mt-5 text-sm text-[rgba(255,255,255,0.45)]">← Retour à la boutique</Link>
    </main>
  )
}

export default AdminLogin
