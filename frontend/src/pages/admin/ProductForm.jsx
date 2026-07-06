import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { adminService } from '../../services/admin.service'
import { getAdminErrorMessage } from '../../utils/adminApi.js'
import { resolveImageUrl } from '../../utils/catalog.js'

const TOGGLES = [
  { key: 'isAvailable', label: 'Disponible' },
  { key: 'isNew',       label: 'Nouveau' },
  { key: 'isBestSeller', label: 'Best-seller' },
  { key: 'isFeatured',  label: 'Featured' },
]

const FORM_FIELDS = ['name', 'description', 'price', 'bgLabel', 'stock', 'category', 'isAvailable', 'isNew', 'isBestSeller', 'isFeatured']

const buildFormData = (form, files, variantFiles) => {
  const fd = new FormData()
  FORM_FIELDS.forEach((k) => {
    const v = form[k]
    if (v === undefined || v === null) return
    if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false')
    else fd.append(k, String(v))
  })
  // Variants as JSON (without photo, photos are sent as files)
  const variantsData = form.variants.map((v) => ({
    title: v.title,
    name: v.name,
    price: v.price,
    stock: v.stock,
    photo: v.photo || '', // existing photo URL (for edits)
  }))
  fd.append('variants', JSON.stringify(variantsData))
  return fd
}

const emptyVariant = () => ({ title: '', name: '', price: 0, stock: 0, photo: '', _file: null, _preview: '' })

const ProductForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const nav = useNavigate()
  const [form, setForm] = useState({
    name: '', description: '', price: 0, bgLabel: '', stock: 999,
    isAvailable: true, isNew: false, isBestSeller: false, isFeatured: false,
    variants: [],
  })
  const [categories, setCategories] = useState([])
  const [files, setFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    adminService.getCategories().then(({ data }) => setCategories(data.data || [])).catch(() => {})
    if (isEdit) {
      adminService.getProducts().then(({ data }) => {
        const p = (data.data || []).find((x) => x._id === id)
        if (p) {
          setForm({
            ...p,
            category: p.category?._id || p.category,
            variants: (p.variants || []).map((v) => ({ ...v, _file: null, _preview: '' })),
          })
        }
      }).catch(() => {})
    }
  }, [id, isEdit])

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  // Variant helpers
  const addVariant = () => setForm((s) => ({ ...s, variants: [...s.variants, emptyVariant()] }))
  const removeVariant = (i) => setForm((s) => ({ ...s, variants: s.variants.filter((_, idx) => idx !== i) }))
  const setVariant = (i, k, v) => setForm((s) => ({
    ...s,
    variants: s.variants.map((vv, idx) => idx === i ? { ...vv, [k]: v } : vv),
  }))
  const setVariantFile = (i, file) => {
    const preview = file ? URL.createObjectURL(file) : ''
    setForm((s) => ({
      ...s,
      variants: s.variants.map((vv, idx) => idx === i ? { ...vv, _file: file, _preview: preview, photo: '' } : vv),
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.category) { setError('Veuillez sélectionner une catégorie.'); return }
    if (!String(form.description || '').trim()) { setError('La description est obligatoire.'); return }
    if (!Number(form.price) && Number(form.price) !== 0) { setError('Veuillez indiquer un prix valide.'); return }
    // Validate variants
    for (let i = 0; i < form.variants.length; i++) {
      const v = form.variants[i]
      if (!v.title?.trim() || !v.name?.trim()) {
        setError(`Variété ${i + 1} : le titre et le nom sont obligatoires.`)
        return
      }
      if (!Number(v.price) && Number(v.price) !== 0) {
        setError(`Variété ${i + 1} : veuillez indiquer un prix valide.`)
        return
      }
    }
    setSaving(true)
    try {
      const fd = buildFormData(form)
      // Product images
      if (isEdit) {
        if (files.length > 0) {
          fd.append('replaceImages', 'true')
          fd.append('hasNewImages', 'true')
          fd.append('existingImages', '[]')
        } else {
          const kept = (form.images || []).map((img) => img)
          fd.append('existingImages', JSON.stringify(kept))
        }
      }
      files.forEach((f) => fd.append('images', f))
      // Variant photos
      form.variants.forEach((v, i) => {
        if (v._file) fd.append(`variantPhoto_${i}`, v._file)
      })
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
              <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Prix de base (TND)</span>
              <input type="number" className={inputCls} placeholder="0" value={form.price || ''} onChange={(e) => set('price', e.target.value)} />
            </label>

            <label className="block">
              <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Stock de base</span>
              <input type="number" className={inputCls} placeholder="999" value={form.stock || ''} onChange={(e) => set('stock', e.target.value)} />
            </label>

            <label className="block">
              <span className="mb-2 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">Images du produit</span>
              {isEdit && (form.images || []).length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {(form.images || []).map((src) => (
                    <img key={src} src={resolveImageUrl(src)} alt="" className="h-16 w-16 border border-nude/60 object-cover" />
                  ))}
                </div>
              )}
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="block w-full font-josefin text-[9px] text-stone/50"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
              {isEdit && (
                <p className="mt-2 font-josefin text-[7px] uppercase tracking-[0.12em] text-stone/45">
                  {files.length > 0 ? 'Les nouvelles images remplaceront les anciennes.' : 'Conservez les images actuelles ou choisissez de nouveaux fichiers.'}
                </p>
              )}
            </label>
          </div>

          {/* Variants */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <p className="font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50">Variétés</p>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1.5 border border-bark/30 px-3 py-1.5 font-josefin text-[8px] uppercase tracking-[0.14em] text-bark hover:bg-bark/5 transition-colors"
              >
                <FiPlus size={11} /> Ajouter une variété
              </button>
            </div>

            {form.variants.length === 0 && (
              <p className="font-josefin text-[8px] text-stone/40 italic">
                Aucune variété. Ajoutez des variantes (couleurs, dimensions…) si nécessaire.
              </p>
            )}

            <div className="space-y-5">
              {form.variants.map((v, i) => (
                <div key={i} className="border border-nude/60 bg-parchment/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-josefin text-[8px] uppercase tracking-[0.18em] text-stone/40">Variété {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="text-stone/40 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.14em] text-stone/40">Type (ex: Couleur, Dimensions)</span>
                      <input
                        className={inputCls}
                        placeholder="Couleur"
                        value={v.title}
                        onChange={(e) => setVariant(i, 'title', e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.14em] text-stone/40">Nom de la variété</span>
                      <input
                        className={inputCls}
                        placeholder="Beige velours"
                        value={v.name}
                        onChange={(e) => setVariant(i, 'name', e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.14em] text-stone/40">Prix (TND)</span>
                      <input
                        type="number"
                        className={inputCls}
                        placeholder="0"
                        value={v.price || ''}
                        onChange={(e) => setVariant(i, 'price', e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.14em] text-stone/40">Stock</span>
                      <input
                        type="number"
                        className={inputCls}
                        placeholder="0"
                        value={v.stock || ''}
                        onChange={(e) => setVariant(i, 'stock', e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="mt-3">
                    <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.14em] text-stone/40">Photo de la variété</span>
                    <div className="flex items-center gap-3">
                      {(v._preview || v.photo) && (
                        <img
                          src={v._preview || resolveImageUrl(v.photo)}
                          alt=""
                          className="h-14 w-14 border border-nude/60 object-cover rounded-card"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="block font-josefin text-[9px] text-stone/50"
                        onChange={(e) => setVariantFile(i, e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="admin-toggle-grid mt-6">
            {TOGGLES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => set(key, !form[key])}
                className={`flex min-h-[44px] items-center justify-between border px-3 transition-colors ${
                  form[key] ? 'border-bark bg-bark/[0.06] text-bark' : 'border-nude/60 text-stone/40'
                }`}
              >
                <span className="font-josefin text-[8px] uppercase tracking-[0.12em]">{label}</span>
                <span className={`h-4 w-8 border transition-colors ${form[key] ? 'border-bark bg-bark' : 'border-nude/60 bg-transparent'}`} />
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 font-josefin text-[9px] text-red-700">{error}</p>
          )}

          <button type="submit" disabled={saving} className="btn-bark mt-6 h-12 w-full justify-center disabled:opacity-60">
            {saving ? 'Enregistrement…' : 'Enregistrer le produit'}
          </button>
        </div>

        {/* Preview panel */}
        <div className="admin-preview border border-nude/60 bg-parchment p-6">
          <p className="mb-5 font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/40">Aperçu</p>
          <div className="border border-nude/60 bg-cream p-5">
            <p className="font-cormorant text-3xl text-ink">{form.name || 'Nom produit'}</p>
            <p className="mt-1 font-josefin text-[18px] font-medium tabular-nums text-bark">{Math.round(Number(form.price || 0))} TND</p>
            {form.description && <p className="mt-3 font-josefin text-[9px] leading-relaxed text-stone/60">{form.description}</p>}
            {form.variants.length > 0 && (
              <div className="mt-4">
                <p className="font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40 mb-2">{form.variants[0].title || 'Variétés'}</p>
                <div className="flex flex-wrap gap-2">
                  {form.variants.map((v, i) => (
                    <div key={i} className="border border-nude/60 rounded-card px-2 py-1">
                      <span className="font-josefin text-[8px] text-stone">{v.name || '—'}</span>
                      {v.price > 0 && <span className="ml-1 font-josefin text-[8px] text-olive">{v.price} TND</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
