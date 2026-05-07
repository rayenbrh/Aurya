import { useEffect, useState } from 'react'
import { adminService } from '../../services/admin.service'

const Categories = () => {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🏷')
  const [showAdd, setShowAdd] = useState(true)
  useEffect(() => {
    adminService.getCategories().then(({ data }) => setItems(data.data || [])).catch(() => {})
  }, [])
  const add = async () => {
    const { data } = await adminService.createCategory({ name, icon })
    setItems((prev) => [...prev, data.data])
    setName('')
  }
  return (
    <section>
      {showAdd && <div className="mb-4 flex gap-2">
        <input className="auth-input border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent p-2" value={icon} onChange={(e) => setIcon(e.target.value)} />
        <input className="auth-input flex-1 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom catégorie" />
        <button onClick={add} className="bg-gold px-4 font-josefin text-[9px] uppercase tracking-[0.2em] text-black">Ajouter</button>
      </div>}
      <div className="space-y-[1px]">{items.map((c) => <div key={c._id} className="flex items-center justify-between border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-4"><p>{c.icon} {c.name}</p><p className="text-xs text-[rgba(255,255,255,0.45)]">{c.count} produits</p></div>)}</div>
      <button className="admin-fab" onClick={() => setShowAdd((v) => !v)}>+</button>
    </section>
  )
}

export default Categories
