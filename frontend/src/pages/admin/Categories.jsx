import { useCallback, useEffect, useState } from 'react'
import { adminService } from '../../services/admin.service'
import { getAdminErrorMessage } from '../../utils/adminApi.js'

const Categories = () => {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🏷')
  const [showAdd, setShowAdd] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')

  const loadCategories = useCallback(() => {
    setLoadError('')
    return adminService.getCategories()
      .then(({ data }) => setItems(data.data || []))
      .catch((err) => {
        setItems([])
        setLoadError(getAdminErrorMessage(err, 'Impossible de charger les catégories.'))
      })
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const add = async (e) => {
    e?.preventDefault()
    setError('')
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Indiquez un nom de catégorie.')
      return
    }
    setSaving(true)
    try {
      const { data } = await adminService.createCategory({
        name: trimmed,
        icon: icon.trim() || '🏷',
        order: items.length,
      })
      setItems((prev) => [...prev, data.data])
      setName('')
      setIcon('🏷')
    } catch (err) {
      setError(getAdminErrorMessage(err, 'Impossible d\'ajouter la catégorie.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      {loadError && (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 font-josefin text-[9px] text-red-700">
          {loadError}
        </p>
      )}

      {showAdd && (
        <form onSubmit={add} className="mb-6 flex flex-wrap gap-3 border border-nude/60 bg-cream p-4">
          <input
            className="w-12 border-b border-nude/80 bg-transparent py-2 text-center font-cormorant text-xl text-ink outline-none"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            aria-label="Icône"
          />
          <input
            className="min-w-[140px] flex-1 border-b border-nude/80 bg-transparent py-2 font-josefin text-[11px] text-ink outline-none placeholder:text-stone/30"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la catégorie"
            required
          />
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="btn-bark h-10 px-5 text-[8px] disabled:opacity-60"
          >
            {saving ? 'Ajout…' : 'Ajouter'}
          </button>
          {error && (
            <p className="w-full border border-red-200 bg-red-50 px-3 py-2 font-josefin text-[9px] text-red-700">
              {error}
            </p>
          )}
        </form>
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

      <button type="button" className="admin-fab" onClick={() => setShowAdd((v) => !v)} aria-label={showAdd ? 'Masquer le formulaire' : 'Ajouter une catégorie'}>
        {showAdd ? '×' : '+'}
      </button>
    </section>
  )
}

export default Categories
