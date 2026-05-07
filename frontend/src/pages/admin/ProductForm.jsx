import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminService } from '../../services/admin.service'

const ProductForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', price: 0, bgLabel: '', stock: 999 })
  const [categories, setCategories] = useState([])
  const [files, setFiles] = useState([])

  useEffect(() => {
    adminService.getCategories().then(({ data }) => setCategories(data.data || [])).catch(() => {})
    if (isEdit) adminService.getProducts().then(({ data }) => {
      const p = (data.data || []).find((x) => x._id === id)
      if (p) setForm({ ...p, category: p.category?._id || p.category })
    }).catch(() => {})
  }, [id, isEdit])

  const submit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''))
    files.forEach((f) => fd.append('images', f))
    if (isEdit) await adminService.updateProduct(id, fd)
    else await adminService.createProduct(fd)
    nav('/admin/products')
  }

  return (
    <section>
      <div className="mb-3 md:hidden">
        <Link to="/admin/products" className="font-josefin text-[8px] uppercase tracking-[0.15em] text-gold">← Retour</Link>
      </div>
      <div className="mb-4 hidden md:block">
        <p className="font-josefin text-[8px] uppercase tracking-[0.15em] text-[rgba(255,255,255,0.45)]">
          <Link to="/admin/products" className="text-gold">Produits</Link> / {isEdit ? 'Modifier' : 'Nouveau'}
        </p>
      </div>
      <form onSubmit={submit} className="admin-two-col">
        <div className="border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-6">
          <p className="mb-4 font-josefin text-[9px] uppercase tracking-[0.2em] text-gold">{isEdit ? 'Modifier produit' : 'Nouveau produit'}</p>
          <input className="auth-input mb-5 w-full border-0 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent py-3" placeholder="Nom" value={form.name || ''} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <select className="mb-5 w-full border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark1 p-3" value={form.category || ''} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}>
            <option value="">Catégorie</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <textarea className="auth-input mb-5 w-full border-0 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent py-3" placeholder="Description" value={form.description || ''} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
          <input type="number" className="auth-input mb-5 w-full border-0 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent py-3" placeholder="Prix" value={form.price || 0} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} />
          <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="mb-6 block w-full text-xs" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
          <div className="admin-toggle-grid mb-6">
            {['Disponible', 'Nouveau', 'Best-seller', 'Featured'].map((t) => (
              <div key={t} className="flex min-h-[44px] items-center justify-between border border-[0.5px] border-[rgba(255,255,255,0.1)] px-3">
                <span className="font-josefin text-[8px] uppercase tracking-[0.12em] text-[rgba(255,255,255,0.45)]">{t}</span>
                <span className="h-4 w-8 border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark4" />
              </div>
            ))}
          </div>
          <button className="h-12 w-full bg-gold font-josefin text-[9px] uppercase tracking-[0.2em] text-black">Enregistrer</button>
        </div>
        <div className="admin-preview border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-6">
          <p className="font-josefin text-[8px] uppercase tracking-[0.2em] text-gold">Aperçu</p>
          <p className="mt-4 font-cormorant text-3xl">{form.name || 'Nom produit'}</p>
          <p className="font-cormorant text-2xl text-gold">{Math.round(Number(form.price || 0))} TND</p>
        </div>
      </form>
    </section>
  )
}

export default ProductForm
