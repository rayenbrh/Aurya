import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  return (
    <main className="relative min-h-screen bg-parchment">
      {/* Warm pattern overlay */}
      <div className="absolute inset-0 warm-pattern opacity-50 pointer-events-none" />

      <div className="relative grid min-h-screen place-items-center px-5 py-16">
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              await login(email, password)
              toast.success('Bienvenue !')
              nav('/compte')
            } catch (err) {
              toast.error(err?.response?.data?.message || 'Erreur de connexion')
            }
          }}
          className="w-full max-w-[440px] rounded-card bg-cream px-8 py-12 shadow-modal md:px-10"
        >
          {/* Logo */}
          <div className="mb-10 text-center">
            <p className="font-cormorant text-[30px] italic font-light text-ink">Aurya</p>
            <p className="mt-1 font-josefin text-[8px] uppercase tracking-[0.3em] text-stone/50">Deco Interiors</p>
          </div>

          {/* Eyebrow */}
          <p className="eyebrow mb-8 text-center">Connexion</p>

          <label className="block">
            <span className="mb-2 block font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/60">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-0 border-b border-nude/80 bg-transparent pb-2.5 font-cormorant text-[16px] text-ink outline-none placeholder:text-stone/30 transition-colors focus:border-bark"
              placeholder="vous@email.com"
            />
          </label>

          <label className="relative mt-7 block">
            <span className="mb-2 block font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/60">Mot de passe</span>
            <input
              required
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-0 border-b border-nude/80 bg-transparent pb-2.5 pr-10 font-cormorant text-[16px] text-ink outline-none placeholder:text-stone/30 transition-colors focus:border-bark"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute bottom-2.5 right-0 text-stone/40 transition-colors hover:text-bark"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? 'Masquer' : 'Afficher'}
            >
              {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </label>

          <button
            type="submit"
            className="btn-bark mt-10 h-[52px] w-full justify-center"
          >
            Se connecter <FiArrowRight size={13} />
          </button>

          <p className="mt-6 text-center font-josefin text-[9px] uppercase tracking-[0.16em] text-stone/50">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="text-bark transition-colors hover:text-ink">
              S&apos;inscrire
            </Link>
          </p>
        </motion.form>
      </div>
    </main>
  )
}
