import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FiMapPin, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi'
import PageTransition from '../components/ui/PageTransition'
import SectionReveal from '../components/ui/SectionReveal'

const contactInfo = [
  { Icon: FiMapPin,  label: 'Adresse',    value: 'Tunis, Tunisie' },
  { Icon: FiPhone,   label: 'Téléphone',  value: '+216 93 091 290', href: 'tel:+21693091290' },
  { Icon: FiMail,    label: 'Email',      value: 'contact@auryadeco.tn' },
]

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', tel: '', sujet: 'Projet salon', message: '' })
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success('Message envoyé !')
      setLoading(false)
      setForm({ nom: '', email: '', tel: '', sujet: 'Projet salon', message: '' })
    }, 600)
  }

  return (
    <PageTransition>
      <main className="bg-cream pt-[60px] md:pt-[72px]">

        {/* Hero */}
        <section className="border-b border-nude/50 bg-parchment px-5 py-14 md:px-16 md:py-20 text-center">
          <SectionReveal>
            <p className="eyebrow mb-4">Parlons ensemble</p>
            <h1
              className="font-cormorant font-light text-ink"
              style={{ fontSize: 'clamp(44px, 5vw, 72px)' }}
            >
              Votre projet <em className="italic text-bark">mérite</em> notre attention
            </h1>
          </SectionReveal>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-[1200px] px-5 py-16 md:px-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">

            {/* Info panel */}
            <div className="rounded-card overflow-hidden bg-sage-dark px-8 py-12 md:px-12 md:py-14">
              <p className="font-josefin text-[8px] uppercase tracking-[0.32em] text-nude/50 mb-5">Contact</p>
              <h2
                className="font-cormorant font-light text-cream leading-[1.1]"
                style={{ fontSize: 'clamp(28px, 3vw, 42px)' }}
              >
                Parlons de votre <em className="italic text-nude">projet</em>
              </h2>
              <p className="mt-4 text-[13px] leading-7 text-nude/65">
                Partagez vos inspirations, plans ou photos — nos décorateurs vous répondent sous 48h avec une première proposition.
              </p>

              <div className="mt-10 space-y-7">
                {contactInfo.map(({ Icon, label, value, href }) => (
                  <motion.div
                    key={label}
                    className="flex items-start gap-4"
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cream/15 text-cream/60">
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="font-josefin text-[8px] uppercase tracking-[0.2em] text-nude/50">{label}</p>
                      {href ? (
                        <a href={href} className="mt-0.5 block text-[13px] text-nude/85 hover:text-cream transition-colors">{value}</a>
                      ) : (
                        <p className="mt-0.5 text-[13px] text-nude/85">{value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <a
                href="https://wa.me/21693091290"
                className="mt-10 inline-flex items-center gap-2 bg-cream px-6 py-3 font-josefin text-[9px] uppercase tracking-[0.22em] text-bark transition-colors hover:bg-nude"
              >
                WhatsApp <FiArrowRight size={12} />
              </a>
            </div>

            {/* Form */}
            <form
              onSubmit={submit}
              className="rounded-card border border-nude/60 bg-parchment p-8 md:p-10 md:px-12"
            >
              <SectionReveal>
                <p className="eyebrow mb-6">Votre message</p>
              </SectionReveal>

              <div className="grid gap-6 md:grid-cols-2">
                {[
                  ['Nom complet', 'nom', 'text'],
                  ['Email', 'email', 'email'],
                  ['Téléphone', 'tel', 'tel'],
                  ['Sujet', 'sujet', 'text'],
                ].map(([label, key, type]) => (
                  <label key={key} className="block">
                    <span className="mb-2 block font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/60">{label}</span>
                    <input
                      required={key !== 'sujet'}
                      type={type}
                      value={form[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className="w-full border-0 border-b border-nude/80 bg-transparent pb-2.5 font-cormorant text-[16px] text-ink outline-none transition-colors focus:border-bark placeholder:text-stone/30"
                    />
                  </label>
                ))}
              </div>

              <label className="mt-6 block">
                <span className="mb-2 block font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/60">Message</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  className="w-full resize-none border-0 border-b border-nude/80 bg-transparent pb-2.5 font-cormorant text-[16px] text-ink outline-none transition-colors focus:border-bark placeholder:text-stone/30"
                  placeholder="Décrivez votre projet…"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-bark mt-10 w-full h-[52px] justify-center disabled:opacity-60"
              >
                {loading ? 'Envoi…' : <>Envoyer le message <FiArrowRight size={13} /></>}
              </button>
            </form>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
