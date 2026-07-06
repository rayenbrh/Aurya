import { useEffect, useState } from 'react'
import { FiCheck, FiTrash2, FiPlus, FiStar } from 'react-icons/fi'
import { adminService } from '../../services/admin.service'
import { getAdminErrorMessage } from '../../utils/adminApi'
import toast from 'react-hot-toast'

function StarDisplay({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar
          key={s}
          size={12}
          className={s <= Math.round(rating) ? 'fill-olive stroke-olive' : 'stroke-stone/30'}
        />
      ))}
    </div>
  )
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="p-0.5"
        >
          <FiStar
            size={20}
            className={s <= (hovered || value) ? 'fill-olive stroke-olive' : 'stroke-stone/30'}
          />
        </button>
      ))}
    </div>
  )
}

const inputCls = 'w-full border-b border-nude/80 bg-transparent pb-2.5 font-josefin text-[11px] text-ink outline-none transition-colors placeholder:text-stone/30 focus:border-bark'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ productId: '', authorName: '', rating: 5, comment: '' })
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all') // all | pending | approved

  const load = () => {
    setLoading(true)
    adminService.getReviews()
      .then(({ data }) => setReviews(data.data || []))
      .catch(() => toast.error('Impossible de charger les avis'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    adminService.getProducts().then(({ data }) => setProducts(data.data || [])).catch(() => {})
  }, [])

  const approve = async (id) => {
    try {
      await adminService.approveReview(id)
      setReviews((prev) => prev.map((r) => r._id === id ? { ...r, isApproved: true } : r))
      toast.success('Avis approuvé')
    } catch {
      toast.error('Erreur')
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Supprimer cet avis ?')) return
    try {
      await adminService.deleteReview(id)
      setReviews((prev) => prev.filter((r) => r._id !== id))
      toast.success('Avis supprimé')
    } catch {
      toast.error('Erreur')
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.productId || !form.authorName || !form.rating || !form.comment) {
      toast.error('Tous les champs sont obligatoires')
      return
    }
    setSaving(true)
    try {
      const { data } = await adminService.createReview(form)
      setReviews((prev) => [data.data, ...prev])
      setShowForm(false)
      setForm({ productId: '', authorName: '', rating: 5, comment: '' })
      toast.success('Avis ajouté')
    } catch (err) {
      toast.error(getAdminErrorMessage(err, 'Impossible d\'ajouter l\'avis'))
    } finally {
      setSaving(false)
    }
  }

  const filtered = reviews.filter((r) => {
    if (filter === 'pending') return !r.isApproved
    if (filter === 'approved') return r.isApproved
    return true
  })

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-cormorant text-3xl font-light text-ink">Avis clients</h1>
          <p className="mt-1 font-josefin text-[8px] uppercase tracking-[0.18em] text-stone/40">
            {reviews.filter((r) => !r.isApproved).length} en attente · {reviews.filter((r) => r.isApproved).length} approuvés
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-bark px-4 py-2.5 font-josefin text-[9px] uppercase tracking-[0.18em] text-cream hover:bg-bark-light transition-colors"
        >
          <FiPlus size={13} /> Ajouter un avis
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-6 border border-nude/60 bg-cream p-6">
          <p className="mb-5 font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50">Ajouter un avis (approuvé directement)</p>
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Produit *</span>
              <select
                className="w-full border-b border-nude/80 bg-transparent pb-2.5 font-josefin text-[11px] text-ink outline-none focus:border-bark"
                value={form.productId}
                onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
                required
              >
                <option value="">— Sélectionner —</option>
                {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Nom du client *</span>
              <input className={inputCls} value={form.authorName} onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))} required />
            </label>
            <div>
              <span className="mb-2 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Note *</span>
              <StarPicker value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
            </div>
            <label className="block">
              <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Commentaire *</span>
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={form.comment}
                onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                required
              />
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-bark h-10 px-6 disabled:opacity-60">
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="h-10 border border-nude/60 px-6 font-josefin text-[9px] uppercase tracking-[0.18em] text-stone hover:text-ink">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2">
        {[['all', 'Tous'], ['pending', 'En attente'], ['approved', 'Approuvés']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 font-josefin text-[8px] uppercase tracking-[0.16em] border transition-colors ${
              filter === key ? 'border-bark bg-bark/[0.06] text-bark' : 'border-nude/60 text-stone/50 hover:border-bark/40'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-josefin text-[9px] text-stone/50">Chargement…</p>
      ) : filtered.length === 0 ? (
        <p className="font-josefin text-[9px] text-stone/50 italic py-8 text-center">Aucun avis.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r._id} className={`border bg-cream p-5 ${r.isApproved ? 'border-nude/60' : 'border-olive/30 bg-olive/[0.03]'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-josefin text-[10px] text-ink font-medium">{r.authorName}</span>
                    <StarDisplay rating={r.rating} />
                    {!r.isApproved && (
                      <span className="rounded-pill bg-olive/15 px-2 py-0.5 font-josefin text-[7px] uppercase tracking-[0.14em] text-olive">
                        En attente
                      </span>
                    )}
                    {r.isAdminAdded && (
                      <span className="rounded-pill bg-bark/10 px-2 py-0.5 font-josefin text-[7px] uppercase tracking-[0.14em] text-bark">
                        Admin
                      </span>
                    )}
                  </div>
                  {r.product?.name && (
                    <p className="font-josefin text-[8px] uppercase tracking-[0.14em] text-stone/40 mb-2">{r.product.name}</p>
                  )}
                  <p className="text-[13px] leading-7 text-stone italic">"{r.comment}"</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!r.isApproved && (
                    <button
                      onClick={() => approve(r._id)}
                      className="grid h-8 w-8 place-items-center border border-olive/40 text-olive hover:bg-olive/10 transition-colors"
                      aria-label="Approuver"
                    >
                      <FiCheck size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => remove(r._id)}
                    className="grid h-8 w-8 place-items-center border border-nude/60 text-stone/50 hover:border-red-300 hover:text-red-500 transition-colors"
                    aria-label="Supprimer"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
