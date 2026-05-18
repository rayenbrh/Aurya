import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminService } from '../../services/admin.service'
import { getAdminErrorMessage } from '../../utils/adminApi.js'

const TOGGLES = [
  { key: 'isAvailable', label: 'Disponible' },
  { key: 'isNew',       label: 'Nouveau' },
  { key: 'isBestSeller', label: 'Best-seller' },
  { key: 'isFeatured',  label: 'Featured' },
]

const FORM_FIELDS = ['name', 'description', 'price', 'bgLabel', 'stock', 'category', 'isAvailable', 'isNew', 'isBestSeller', 'isFeatured']

const buildFormData = (form) => {
  const fd = new FormData()
  FORM_FIELDS.forEach((k) => {
    const v = form[k]
    if (v === undefined || v === null) return
    if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false')
    else fd.append(k, String(v))
  })
  return fd
}

const ProductForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const nav = useNavigate()
  const [form, setForm]   = useState({ name: '', description: '', price: 0, bgLabel: '', stock: 999, isAvailable: true, isNew: false, isBestSeller: false, isFeatured: false })
  const [categories, setCategories] = useState([])
  const [files, setFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    adminService.getCategories().then(({ data }) => setCategories(data.data || [])).catch(() => {})
    if (isEdit) {
      adminService.getProducts().then(({ data }) => {
        const p = (data.data || []).find((x) => x._id === id)
        if (p) setForm({ ...p, category: p.category?._id || p.category })
      }).catch(() => {})
    }
  }, [id, isEdit])

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.category) {
      setError('Veuillez sélectionner une catégorie.')
      return
    }
    if (!String(form.description || '').trim()) {
      setError('La description est obligatoire.')
      return
    }
    if (!Number(form.price) && Number(form.price) !== 0) {
      setError('Veuillez indiquer un prix valide.')
      return
    }
    setSaving(true)
    try {
      const fd = buildFormData(form)
      files.forEach((f) => fd.append('images', f))
      if (isEdit) await adminService.updateProduct(id, fd)
      else await adminService.createProduct(fd)
      nav('/admin/products')
    } catch (err) {
      setError(getAdminErrorMessage(err, 'Impossible d\'enregistrer le produit.'))
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full border-b border-nude/80 bg-transparent pb-2.5 font-josefin text-[11px] text-ink outline-none transition-colors placeholder:text-stone/30 focus:border-bark'

  return (
    <section>
      <div className="mb-5">
        <p className="font-josefin text-[8px] uppercase tracking-[0.15em] text-stone/40">
          <Link to="/admin/products" className="text-bark hover:text-ink">Produits</Link>
          {' '}/ {isEdit ? 'Modifier' : 'Nouveau'}
        </p>
      </div>

      <form onSubmit={submit} className="admin-two-col">
        {/* Form panel */}
        <div className="border border-nude/60 bg-cream p-6">
          <p className="mb-6 font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50">
            {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
          </p>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Nom</span>
              <input className={inputCls} placeholder="Nom du produit" value={form.name || ''} onChange={(e) => set('name', e.target.value)} required />
            </label>

            <label className="block">
              <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Catégorie</span>
              <select
                className="w-full border-b border-nude/80 bg-transparent pb-2.5 font-josefin text-[11px] text-ink outline-none focus:border-bark"
                value={form.category || ''}
                onChange={(e) => set('category', e.target.value)}
                required
              >
                <option value="">— Sélectionner —</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Description</span>
              <textarea
                className={`${inputCls} resize-none`}
                placeholder="Description"
                rows={3}
                value={form.description || ''}
                onChange={(e) => set('description', e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Prix (TND)</span>
              <input type="number" className={inputCls} placeholder="0" value={form.price || ''} onChange={(e) => set('price', e.target.value)} />
            </label>

            <label className="block">
              <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Stock</span>
              <input type="number" className={inputCls} placeholder="999" value={form.stock || ''} onChange={(e) => set('stock', e.target.value)} />
            </label>

            <label className="block">
              <span className="mb-2 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Images</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="block w-full font-josefin text-[9px] text-stone/50"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </label>
          </div>

          {/* Toggles */}
          <div className="admin-toggle-grid mt-6">
            {TOGGLES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => set(key, !form[key])}
                className={`flex min-h-[44px] items-center justify-between border px-3 transition-colors ${
                  form[key]
                    ? 'border-bark bg-bark/[0.06] text-bark'
                    : 'border-nude/60 text-stone/40'
                }`}
              >
                <span className="font-josefin text-[8px] uppercase tracking-[0.12em]">{label}</span>
                <span className={`h-4 w-8 border transition-colors ${form[key] ? 'border-bark bg-bark' : 'border-nude/60 bg-transparent'}`} />
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 font-josefin text-[9px] text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-bark mt-6 h-12 w-full justify-center disabled:opacity-60"
          >
            {saving ? 'Enregistrement…' : 'Enregistrer le produit'}
          </button>
        </div>

        {/* Preview panel */}
        <div className="admin-preview border border-nude/60 bg-parchment p-6">
          <p className="mb-5 font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/40">Aperçu</p>
          <div className="border border-nude/60 bg-cream p-5">
            <p className="font-cormorant text-3xl text-ink">{form.name || 'Nom produit'}</p>
            <p className="mt-1 font-cormorant text-2xl text-bark">{Math.round(Number(form.price || 0))} TND</p>
            {form.description && <p className="mt-3 font-josefin text-[9px] leading-relaxed text-stone/60">{form.description}</p>}
          </div>
          <div className="mt-4 space-y-1">
            {TOGGLES.filter(({ key }) => form[key]).map(({ label }) => (
              <span key={label} className="mr-2 inline-block border border-bark/30 bg-bark/[0.06] px-2 py-1 font-josefin text-[7px] uppercase tracking-[0.12em] text-bark">
                {label}
              </span>
            ))}
          </div>
        </div>
      </form>
    </section>
  )
}

export default ProductForm
