import { useState } from 'react'
import toast from 'react-hot-toast'
import PageTransition from '../components/ui/PageTransition'

const Contact = () => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', tel: '', projet: 'Salon', message: '' })
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const submit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success('Message envoyé')
      setLoading(false)
      setForm({ nom: '', email: '', tel: '', projet: 'Salon', message: '' })
    }, 700)
  }
  return (
    <PageTransition>
      <main className="grid grid-cols-1 gap-8 px-5 pb-14 pt-24 md:grid-cols-2 md:px-16 md:pb-24">
        <section>
          <p className="eyebrow">Nous contacter</p>
          <h1 className="mt-5 font-cormorant text-5xl font-light">Parlons de votre <em className="text-gold">projet</em></h1>
          <span className="gold-rule my-6" />
          {['Tunis, Tunisie', '+216 XX XXX XXX', 'Lun–Sam: 9h–19h'].map((i) => <div key={i} className="border-b border-[0.5px] border-[rgba(255,255,255,0.10)] py-5 text-[rgba(255,255,255,0.75)]">{i}</div>)}
        </section>
        <form onSubmit={submit} className="border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-8">
          {[
            ['Prénom et nom', 'nom', 'text', true],
            ['Email', 'email', 'email', false],
            ['Téléphone', 'tel', 'tel', true],
          ].map(([label, key, type, req]) => (
            <label key={key} className="mb-5 block">
              <span className="mb-1 block font-josefin text-[8px] uppercase tracking-[0.18em] text-gold">{label}</span>
              <input required={req} type={type} value={form[key]} onChange={(e) => update(key, e.target.value)} className="w-full border-0 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent py-3 text-sm text-white focus:border-gold focus:outline-none" />
            </label>
          ))}
          <label className="mb-5 block"><span className="mb-1 block font-josefin text-[8px] uppercase tracking-[0.18em] text-gold">Projet</span><select value={form.projet} onChange={(e) => update('projet', e.target.value)} className="w-full border-0 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent py-3 text-sm"><option>Salon</option><option>Chambre</option><option>Salle à manger</option><option>Autre</option></select></label>
          <label className="mb-5 block"><span className="mb-1 block font-josefin text-[8px] uppercase tracking-[0.18em] text-gold">Message</span><textarea required rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} className="w-full border-0 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent py-3 text-sm text-white focus:border-gold focus:outline-none" /></label>
          <button aria-label="Envoyer le message" className="h-[50px] w-full bg-gold font-josefin text-[9px] uppercase tracking-[0.22em] text-black">{loading ? 'ENVOI EN COURS...' : 'ENVOYER LE MESSAGE →'}</button>
        </form>
      </main>
    </PageTransition>
  )
}

export default Contact
