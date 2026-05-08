import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const AdminLogin = () => {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow]         = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login, isAdmin }      = useAuth()
  const navigate                = useNavigate()

  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true })
  }, [isAdmin, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user.role !== 'admin') {
        setError('Accès réservé aux administrateurs.')
        return
      }
      navigate('/admin')
    } catch (err) {
      setError(err?.response?.data?.message || 'Identifiants invalides')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-parchment">
      <div className="absolute inset-0 warm-pattern opacity-40 pointer-events-none" />

      <div className="relative grid min-h-screen place-items-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          className="w-full max-w-[400px]"
        >
          <form onSubmit={onSubmit} className="rounded-card border border-nude/60 bg-cream px-8 py-12 shadow-modal">
            {/* Logo + brand */}
            <div className="mb-10 flex flex-col items-center gap-3">
              <img src="/logo.png" alt="Aurya" className="h-10 w-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <div className="text-center">
                <p className="font-cormorant text-[28px] italic font-light text-ink">Aurya</p>
                <p className="mt-0.5 font-josefin text-[8px] uppercase tracking-[0.3em] text-stone/50">Administration</p>
              </div>
            </div>

            <p className="eyebrow mb-8 justify-center">Connexion Admin</p>

            <label className="block">
              <span className="mb-2 block font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/60">Email</span>
              <input
                required
                type="email"
                value={email}
                autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-0 border-b border-nude/80 bg-transparent pb-2.5 font-cormorant text-[16px] text-ink outline-none placeholder:text-stone/30 transition-colors focus:border-bark"
                placeholder="admin@auryadeco.tn"
              />
            </label>

            <label className="relative mt-7 block">
              <span className="mb-2 block font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/60">Mot de passe</span>
              <input
                required
                type={show ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-0 border-b border-nude/80 bg-transparent pb-2.5 pr-8 font-cormorant text-[16px] text-ink outline-none placeholder:text-stone/30 transition-colors focus:border-bark"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute bottom-2.5 right-0 text-stone/40 hover:text-bark" aria-label="Afficher">
                {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </label>

            {error && (
              <p className="mt-4 rounded-card border border-bark/20 bg-bark/[0.06] px-3 py-2 font-josefin text-[9px] uppercase tracking-[0.14em] text-bark">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-bark mt-8 h-[52px] w-full justify-center disabled:opacity-60"
            >
              {loading ? 'Connexion…' : <>Accéder au panel <FiArrowRight size={13} /></>}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link to="/" className="font-josefin text-[9px] uppercase tracking-[0.18em] text-stone/50 transition-colors hover:text-bark">
              ← Retour à la boutique
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

export default AdminLogin
