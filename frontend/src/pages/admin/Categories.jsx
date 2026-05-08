import { useEffect, useState } from 'react'
import { adminService } from '../../services/admin.service'

const Categories = () => {
  const [items, setItems]   = useState([])
  const [name, setName]     = useState('')
  const [icon, setIcon]     = useState('🏷')
  const [showAdd, setShowAdd] = useState(true)

  useEffect(() => {
    adminService.getCategories().then(({ data }) => setItems(data.data || [])).catch(() => {})
  }, [])

  const add = async () => {
    if (!name.trim()) return
    const { data } = await adminService.createCategory({ name, icon })
    setItems((prev) => [...prev, data.data])
    setName('')
  }

  return (
    <section>
      {showAdd && (
        <div className="mb-6 flex gap-3 border border-nude/60 bg-cream p-4">
          <input
            className="w-12 border-b border-nude/80 bg-transparent py-2 text-center font-cormorant text-xl text-ink outline-none"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
          <input
            className="flex-1 border-b border-nude/80 bg-transparent py-2 font-josefin text-[11px] text-ink outline-none placeholder:text-stone/30"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la catégorie"
          />
          <button
            onClick={add}
            className="btn-bark h-10 px-5 text-[8px]"
          >
            Ajouter
          </button>
        </div>
      )}

      <div className="space-y-[1px]">
        {items.map((c) => (
          <div key={c._id} className="flex items-center justify-between border border-nude/60 bg-cream px-5 py-4 transition-colors hover:bg-parchment/40">
            <p className="font-josefin text-[10px] uppercase tracking-[0.15em] text-ink">{c.icon} {c.name}</p>
            <p className="font-josefin text-[8px] text-stone/40">{c.count ?? 0} produit{c.count !== 1 ? 's' : ''}</p>
          </div>
        ))}
        {items.length === 0 && (
          <p className="py-10 text-center font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/30">Aucune catégorie</p>
        )}
      </div>

      <button className="admin-fab" onClick={() => setShowAdd((v) => !v)}>+</button>
    </section>
  )
}

export default Categories
