import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { authService } from '../services/auth.service'

const steps = {
  1: { title: 'Identité',  fields: [['Prénom', 'prenom', 'text'], ['Nom', 'nom', 'text'], ['Email', 'email', 'email'], ['Mot de passe', 'password', 'password']] },
  2: { title: 'Contact',   fields: [['Téléphone', 'tel', 'tel']] },
  3: { title: 'Adresse',   fields: [['Rue et numéro', 'rue', 'text'], ['Ville', 'ville', 'text'], ['Région', 'region', 'text']] },
}

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({})
  const [dir, setDir] = useState(1)
  const nav = useNavigate()
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }))

  const goNext = () => { setDir(1); setStep((s) => s + 1) }
  const goBack = () => { setDir(-1); setStep((s) => s - 1) }

  return (
    <main className="relative min-h-screen bg-parchment">
      <div className="absolute inset-0 warm-pattern opacity-50 pointer-events-none" />

      <div className="relative grid min-h-screen place-items-center px-5 py-16">
        <div className="w-full max-w-[440px] rounded-card bg-cream px-8 py-12 shadow-modal md:px-10">

          {/* Logo */}
          <div className="mb-8 text-center">
            <p className="font-cormorant text-[30px] italic font-light text-ink">Aurya</p>
            <p className="mt-1 font-josefin text-[8px] uppercase tracking-[0.3em] text-stone/50">Deco Interiors</p>
          </div>

          {/* Step indicators */}
          <div className="flex gap-1.5 mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[3px] flex-1 rounded-pill transition-all duration-400"
                style={{ background: i <= step ? '#7B4F3A' : 'rgba(212,196,181,0.6)' }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: dir * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -30 }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            >
              <p className="eyebrow mb-2">Étape {step}/3</p>
              <h2 className="font-cormorant text-2xl font-light text-ink mb-7">{steps[step].title}</h2>

              <div className="space-y-6">
                {steps[step].fields.map(([label, key, type]) => (
                  <label key={key} className="block">
                    <span className="mb-2 block font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/60">{label}</span>
                    <input
                      required
                      type={type}
                      value={data[key] || ''}
                      onChange={(e) => set(key, e.target.value)}
                      className="w-full border-0 border-b border-nude/80 bg-transparent pb-2.5 font-cormorant text-[16px] text-ink outline-none placeholder:text-stone/30 transition-colors focus:border-bark"
                    />
                  </label>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="btn-outline-bark h-[52px] px-4 flex items-center gap-1"
              >
                <FiArrowLeft size={13} />
              </button>
            )}
            <button
              type="button"
              className="btn-bark h-[52px] flex-1 justify-center"
              onClick={async () => {
                if (step < 3) { goNext(); return }
                try {
                  await authService.register({
                    firstName: data.prenom,
                    lastName:  data.nom,
                    email:     data.email,
                    phone:     data.tel,
                    password:  data.password,
                    address:   { street: data.rue, city: data.ville || 'Tunis', region: data.region },
                  })
                  toast.success('Compte créé — connectez-vous !')
                  nav('/connexion')
                } catch (err) {
                  toast.error(err?.response?.data?.message || "Erreur lors de l'inscription")
                }
              }}
            >
              {step < 3 ? <>Continuer <FiArrowRight size={13} /></> : <>Créer le compte <FiArrowRight size={13} /></>}
            </button>
          </div>

          <p className="mt-6 text-center font-josefin text-[9px] uppercase tracking-[0.16em] text-stone/50">
            Déjà membre ?{' '}
            <Link to="/connexion" className="text-bark transition-colors hover:text-ink">
              Connexion
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
