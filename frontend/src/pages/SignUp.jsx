import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageTransition from '../components/ui/PageTransition'
import { authService } from '../services/auth.service'

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

const SignUp = () => {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({})
  const nav = useNavigate()
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }))
  const stepTitle = step === 1 ? 'Identité' : step === 2 ? 'Contact' : 'Adresse'
  return (
    <PageTransition>
      <main className="grid min-h-screen place-items-center px-5 pt-20">
        <div className="w-full max-w-[440px] border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 px-6 py-9 sm:px-10 sm:py-12">
          <img src="/logo.png" alt="Aurya Deco" style={{ width: '48px', height: '48px', objectFit: 'contain', display: 'block', margin: '0 auto 24px' }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: '300', fontStyle: 'italic', color: '#C9A84C', textAlign: 'center', marginBottom: '4px', lineHeight: '1' }}>Créer un compte</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '10px', fontWeight: '200', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: '36px' }}>REJOIGNEZ-NOUS</div>

          <div className="mb-9 flex justify-center gap-1">{[1, 2, 3].map((i) => <span key={i} className={`h-[0.5px] w-[60px] ${i <= step ? 'bg-gold' : 'bg-white/20'}`} />)}</div>
          <h2 className="mb-7 text-left font-cormorant text-[22px] font-light text-[rgba(255,255,255,0.92)]">{stepTitle}</h2>

          {step === 1 && (
            <>
              <div style={{ marginBottom: '28px', width: '100%' }}><label style={labelStyle}>Prénom</label><input className="auth-input focus:border-b-[0.5px] focus:border-gold" required value={data.prenom || ''} onChange={(e) => set('prenom', e.target.value)} placeholder="Votre prénom" style={authInputStyle} /></div>
              <div style={{ marginBottom: '28px', width: '100%' }}><label style={labelStyle}>Nom</label><input className="auth-input focus:border-b-[0.5px] focus:border-gold" required value={data.nom || ''} onChange={(e) => set('nom', e.target.value)} placeholder="Votre nom" style={authInputStyle} /></div>
              <div style={{ marginBottom: '28px', width: '100%' }}><label style={labelStyle}>Email</label><input className="auth-input focus:border-b-[0.5px] focus:border-gold" required type="email" value={data.email || ''} onChange={(e) => set('email', e.target.value)} placeholder="Votre email" style={authInputStyle} /></div>
              <div style={{ marginBottom: '28px', width: '100%' }}><label style={labelStyle}>Mot de passe</label><input className="auth-input focus:border-b-[0.5px] focus:border-gold" required type="password" value={data.password || ''} onChange={(e) => set('password', e.target.value)} placeholder="Votre mot de passe" style={authInputStyle} /></div>
            </>
          )}
          {step === 2 && (
            <div style={{ marginBottom: '28px', width: '100%' }}>
              <label style={labelStyle}>Téléphone</label>
              <input className="auth-input focus:border-b-[0.5px] focus:border-gold" required value={data.tel || ''} onChange={(e) => set('tel', e.target.value)} placeholder="Votre numéro tunisien" style={authInputStyle} />
            </div>
          )}
          {step === 3 && (
            <>
              <div style={{ marginBottom: '28px', width: '100%' }}><label style={labelStyle}>Rue et numéro</label><input className="auth-input focus:border-b-[0.5px] focus:border-gold" required value={data.rue || ''} onChange={(e) => set('rue', e.target.value)} placeholder="Votre adresse" style={authInputStyle} /></div>
              <div style={{ marginBottom: '28px', width: '100%' }}><label style={labelStyle}>Ville</label><input className="auth-input focus:border-b-[0.5px] focus:border-gold" required value={data.ville || ''} onChange={(e) => set('ville', e.target.value)} placeholder="Votre ville" style={authInputStyle} /></div>
              <div style={{ marginBottom: '28px', width: '100%' }}><label style={labelStyle}>Région</label><input className="auth-input focus:border-b-[0.5px] focus:border-gold" required value={data.region || ''} onChange={(e) => set('region', e.target.value)} placeholder="Votre région" style={authInputStyle} /></div>
            </>
          )}

          <button
            aria-label="Continuer l'inscription"
            className="mt-2 h-[50px] w-full bg-gold font-josefin text-[9px] font-normal uppercase tracking-[0.22em] text-black transition-colors hover:bg-gold-light"
            onClick={async () => {
              if (step < 3) {
                setStep(step + 1)
                return
              }
              try {
                await authService.register({
                  firstName: data.prenom,
                  lastName: data.nom,
                  email: data.email,
                  phone: data.tel,
                  password: data.password,
                  address: {
                    street: data.rue,
                    city: data.ville || 'Tunis',
                    region: data.region,
                  },
                })
                toast.success('Bienvenue chez Aurya Deco')
                nav('/connexion')
              } catch (err) {
                toast.error(err?.response?.data?.message || 'Erreur inscription')
              }
            }}
          >
            {step < 3 ? 'Continuer' : "Terminer l'inscription"}
          </button>
          <div className="mt-5 text-center font-dm text-[13px] font-light text-[rgba(255,255,255,0.35)]">
            Déjà inscrit ? <Link to="/connexion" className="text-gold hover:underline">Se connecter →</Link>
          </div>
        </div>
      </main>
    </PageTransition>
  )
}

export default SignUp
