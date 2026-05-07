import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import PageTransition from '../components/ui/PageTransition'

const authInputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '0.5px solid rgba(255,255,255,0.15)',
  borderRadius: '0px',
  color: 'rgba(255,255,255,0.92)',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '14px',
  fontWeight: '300',
  lineHeight: '1.5',
  padding: '14px 0px 14px 0px',
  textAlign: 'left',
  direction: 'ltr',
  outline: 'none',
  display: 'block',
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block',
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: '8px',
  fontWeight: '400',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#C9A84C',
  marginBottom: '8px',
}

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const nav = useNavigate()
  const { login } = useAuth()
  return (
    <PageTransition>
      <main className="grid min-h-screen place-items-center bg-obsidian px-5 pt-20">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              await login(email, password)
              toast.success('Bienvenue chez Aurya Deco')
              nav('/compte')
            } catch (err) {
              toast.error(err?.response?.data?.message || 'Erreur de connexion')
            }
          }}
          className="grid-pattern w-full max-w-[440px] border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 px-6 py-9 sm:px-10 sm:py-12"
        >
          <img src="/logo.png" alt="Aurya Deco" style={{ width: '48px', height: '48px', objectFit: 'contain', display: 'block', margin: '0 auto 24px' }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: '300', fontStyle: 'italic', color: '#C9A84C', textAlign: 'center', marginBottom: '4px', lineHeight: '1' }}>Bon retour</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '10px', fontWeight: '200', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: '36px' }}>AURYA DECO</div>

          <div style={{ marginBottom: '28px', width: '100%' }}>
            <label style={labelStyle}>Email</label>
            <input className="auth-input focus:border-b-[0.5px] focus:border-gold" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" type="email" style={authInputStyle} />
          </div>

          <div style={{ marginBottom: '28px', width: '100%', position: 'relative' }}>
            <label style={labelStyle}>Mot de passe</label>
            <input className="auth-input focus:border-b-[0.5px] focus:border-gold" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Votre mot de passe" type={showPassword ? 'text' : 'password'} style={{ ...authInputStyle, paddingRight: '30px' }} />
            <button type="button" aria-label="Afficher ou masquer le mot de passe" onClick={() => setShowPassword((v) => !v)} className="absolute right-0 top-[35px] text-[rgba(255,255,255,0.3)] hover:text-gold">
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          <button aria-label="Se connecter" className="mt-2 h-[50px] w-full bg-gold font-josefin text-[9px] font-normal uppercase tracking-[0.22em] text-black transition-colors hover:bg-gold-light">Connexion</button>
          <div className="mt-5 text-center font-dm text-[13px] font-light text-[rgba(255,255,255,0.35)]">
            Pas encore de compte ? <Link to="/inscription" className="text-gold hover:underline">S'inscrire →</Link>
          </div>
        </form>
      </main>
    </PageTransition>
  )
}

export default SignIn
