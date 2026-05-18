import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmModal from '../../components/admin/ConfirmModal'
import { adminService } from '../../services/admin.service'
import { getAdminErrorMessage } from '../../utils/adminApi.js'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    adminService.getProducts()
      .then(({ data }) => setProducts(data.data || []))
      .catch((err) => setLoadError(getAdminErrorMessage(err, 'Impossible de charger les produits.')))
  }, [])

  const remove = async () => {
    if (!confirmDelete) return
    const { id } = confirmDelete
    setDeletingId(id)
    setActionError('')
    try {
      await adminService.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      setConfirmDelete(null)
    } catch (err) {
      setActionError(getAdminErrorMessage(err, 'Impossible de supprimer le produit.'))
      setConfirmDelete(null)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section>
      {loadError && (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 font-josefin text-[9px] text-red-700">{loadError}</p>
      )}
      {actionError && (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 font-josefin text-[9px] text-red-700">{actionError}</p>
      )}

      <div className="mb-5 flex items-center justify-between">
        <p className="font-josefin text-[11px] uppercase tracking-[0.2em] text-ink">Produits</p>
        <Link
          to="/admin/products/new"
          className="btn-bark h-10 px-4 text-[8px]"
        >
          + Ajouter
        </Link>
      </div>

      <div className="admin-table-wrapper border border-nude/60">
        <div className="grid min-w-[820px] grid-cols-[1fr_120px_100px_90px_90px_120px_120px] bg-parchment px-4 py-3 font-josefin text-[8px] uppercase tracking-[0.12em] text-stone/50">
          <span>Produit</span>
          <span>Prix</span>
          <span className="admin-col-hide-mobile">Stock</span>
          <span className="admin-col-hide-mobile">Ventes</span>
          <span>Statut</span>
          <span>Catégorie</span>
          <span>Actions</span>
        </div>

        {products.map((p) => (
          <div key={p._id} className="grid min-w-[820px] grid-cols-[1fr_120px_100px_90px_90px_120px_120px] border-t border-nude/40 bg-cream px-4 py-3 transition-colors hover:bg-parchment/40">
            <div>
              <p className="font-cormorant text-2xl text-ink">{p.name}</p>
              <p className="font-josefin text-[8px] text-stone/40">{p.slug}</p>
            </div>
            <p className="font-cormorant text-xl text-bark">{Math.round(p.price)} TND</p>
            <p className="admin-col-hide-mobile font-josefin text-[9px] text-stone/60">{p.stock ?? 0}</p>
            <p className="admin-col-hide-mobile font-josefin text-[9px] text-stone/60">{p.orderCount ?? 0}</p>
            <span className={`font-josefin text-[8px] uppercase tracking-[0.1em] ${p.isAvailable ? 'text-[#1e6b43]' : 'text-stone/40'}`}>
              {p.isAvailable ? 'Actif' : 'Masqué'}
            </span>
            <span className="font-josefin text-[8px] uppercase tracking-[0.1em] text-stone/50">{p.category?.name || '—'}</span>
            <div className="flex flex-col gap-1">
              <Link className="font-josefin text-[8px] uppercase tracking-[0.15em] text-bark hover:text-ink" to={`/admin/products/${p._id}/edit`}>
                Modifier
              </Link>
              <button
                type="button"
                disabled={deletingId === p._id}
                onClick={() => setConfirmDelete({ id: p._id, name: p.name })}
                className="text-left font-josefin text-[8px] uppercase tracking-[0.12em] text-[#9b3d3d] transition-colors hover:text-[#7a2f2f] disabled:opacity-50"
              >
                {deletingId === p._id ? '…' : 'Supprimer'}
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <p className="py-10 text-center font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/30">Aucun produit</p>
        )}
      </div>

      <button type="button" className="admin-fab" onClick={() => navigate('/admin/products/new')}>+</button>

      <ConfirmModal
        isOpen={Boolean(confirmDelete)}
        title="Supprimer le produit"
        message={confirmDelete ? `Retirer « ${confirmDelete.name} » du catalogue ? Le produit sera masqué.` : ''}
        confirmLabel="Supprimer"
        onConfirm={remove}
        onCancel={() => setConfirmDelete(null)}
      />
    </section>
  )
}

export default AdminProducts
