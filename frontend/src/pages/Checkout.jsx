import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiPhone } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'
import { ordersService } from '../services/orders.service'
import { getAdminErrorMessage } from '../utils/adminApi'

const inputCls =
  'w-full border-b border-nude/80 bg-transparent pb-2.5 font-josefin text-[11px] text-ink outline-none transition-colors placeholder:text-stone/30 focus:border-bark'

export default function Checkout() {
  const { items, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: 'Tunis',
    region: '',
    notes: '',
  })

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  useEffect(() => {
    if (!items.length) return
    if (isAuthenticated && user) {
      setForm((s) => ({
        ...s,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || s.fullName,
        phone: user.phone || s.phone,
        email: user.email || s.email,
        street: user.address?.street || s.street,
        city: user.address?.city || s.city,
        region: user.address?.region || s.region,
        notes: user.address?.notes || s.notes,
      }))
    }
  }, [isAuthenticated, user, items.length])

  if (!items.length) {
    return (
      <main className="min-h-[60vh] bg-cream px-5 pb-20 pt-[100px] text-center md:px-16">
        <p className="font-cormorant text-3xl text-ink">Votre panier est vide</p>
        <Link to="/collections" className="btn-bark mt-6 inline-flex h-11 px-6 text-[9px]">
          Voir les collections
        </Link>
      </main>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const fullName = form.fullName.trim()
    const phone = form.phone.trim()
    const street = form.street.trim()
    if (!fullName || !phone || !street) {
      setError('Nom complet, téléphone et adresse complète sont obligatoires.')
      return
    }
    setSaving(true)
    try {
      const { data } = await ordersService.createOrder({
        items: items.map(({ product, quantity, variant }) => ({
          productId: product._id || product.id,
          quantity,
          variant: variant ? { title: variant.title, name: variant.name } : undefined,
        })),
        customer: {
          fullName,
          phone,
          email: form.email.trim(),
          address: {
            street,
            city: form.city.trim() || 'Tunis',
            region: form.region.trim(),
            country: 'Tunisie',
            notes: form.notes.trim(),
          },
          comments: form.notes.trim(),
          isGuest: !isAuthenticated,
        },
        notes: form.notes.trim(),
        source: 'website',
      })
      const orderNumber = data?.data?.order?.orderNumber
      clearCart()
      toast.success('Commande enregistrée avec succès')
      navigate(orderNumber ? `/suivi/${orderNumber}` : '/suivi')
    } catch (err) {
      setError(getAdminErrorMessage(err, 'Impossible de passer la commande.'))
    } finally {
      setSaving(false)
    }
  }

  const getPrice = (item) => item.variant?.price ?? item.product.price
  const subtotal = items.reduce((acc, i) => acc + i.quantity * getPrice(i), 0)

  return (
    <main className="bg-cream px-5 pb-24 pt-[88px] md:px-16 md:pt-[100px]">
      <div className="mx-auto max-w-[1100px]">
        <p className="eyebrow mb-3">Commande</p>
        <h1 className="font-cormorant text-4xl font-light text-ink md:text-5xl">Finaliser la commande</h1>
        <p className="mt-2 font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/55">
          Paiement à la livraison · Sans compte requis
        </p>
        <a
          href="tel:+21693091290"
          className="mt-3 inline-flex items-center gap-2 rounded-card border border-bark/20 bg-bark/5 px-4 py-2.5 font-josefin text-[10px] text-bark transition-colors hover:bg-bark/10"
        >
          <FiPhone size={12} /> Besoin d'aide ? +216 93 091 290
        </a>

        <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="border border-nude/60 bg-cream p-6 md:p-8">
            <p className="mb-6 font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50">Vos coordonnées</p>
            <div className="space-y-5">
              <label className="block">
                <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Nom complet *</span>
                <input className={inputCls} value={form.fullName} onChange={(e) => set('fullName', e.target.value)} required />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Téléphone *</span>
                <input type="tel" className={inputCls} value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Email (optionnel)</span>
                <input type="email" className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Adresse complète *</span>
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={3}
                  placeholder="Rue, numéro, immeuble, gouvernorat…"
                  value={form.street}
                  onChange={(e) => set('street', e.target.value)}
                  required
                />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Ville</span>
                  <input className={inputCls} value={form.city} onChange={(e) => set('city', e.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Gouvernorat</span>
                  <input className={inputCls} value={form.region} onChange={(e) => set('region', e.target.value)} />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Notes (optionnel)</span>
                <input className={inputCls} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
              </label>
            </div>
            {error && (
              <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 font-josefin text-[9px] text-red-700">{error}</p>
            )}
          </div>

          <aside className="h-fit border border-nude/60 bg-parchment p-6">
            <p className="mb-4 font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50">Récapitulatif</p>
            <div className="max-h-[280px] space-y-3 overflow-y-auto">
              {items.map((item) => {
                const { product, quantity, variant, _key } = item
                return (
                  <div key={_key} className="flex justify-between gap-3 border-b border-nude/40 pb-3">
                    <div>
                      <p className="font-josefin text-[9px] text-ink">{product.name}</p>
                      {variant && <p className="font-josefin text-[8px] text-bark/60">{variant.title} : {variant.name}</p>}
                      <p className="font-josefin text-[8px] text-stone/50">× {quantity}</p>
                    </div>
                    <p className="font-josefin text-[15px] font-medium tabular-nums text-bark">{formatPrice(getPrice(item) * quantity)}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex justify-between border-t border-nude/60 pt-4">
              <span className="font-josefin text-[9px] uppercase tracking-[0.15em] text-stone/60">Total</span>
              <span className="font-cormorant text-2xl text-bark">{formatPrice(subtotal)}</span>
            </div>
            <button type="submit" disabled={saving} className="btn-bark mt-6 h-12 w-full justify-center disabled:opacity-60">
              {saving ? 'Envoi en cours…' : 'Confirmer la commande'}
            </button>
            <p className="mt-3 text-center font-josefin text-[7px] uppercase tracking-[0.15em] text-stone/45">
              Espèces à la livraison
            </p>
          </aside>
        </form>
      </div>
    </main>
  )
}
