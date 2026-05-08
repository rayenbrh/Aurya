import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminService } from '../../services/admin.service'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    adminService.getProducts().then(({ data }) => setProducts(data.data || [])).catch(() => {})
  }, [])

  return (
    <section>
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
        <div className="grid min-w-[760px] grid-cols-[1fr_120px_100px_90px_90px_120px_80px] bg-parchment px-4 py-3 font-josefin text-[8px] uppercase tracking-[0.12em] text-stone/50">
          <span>Produit</span>
          <span>Prix</span>
          <span className="admin-col-hide-mobile">Stock</span>
          <span className="admin-col-hide-mobile">Ventes</span>
          <span>Statut</span>
          <span>Catégorie</span>
          <span>Actions</span>
        </div>

        {products.map((p) => (
          <div key={p._id} className="grid min-w-[760px] grid-cols-[1fr_120px_100px_90px_90px_120px_80px] border-t border-nude/40 bg-cream px-4 py-3 transition-colors hover:bg-parchment/40">
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
            <Link className="font-josefin text-[8px] uppercase tracking-[0.15em] text-bark hover:text-ink" to={`/admin/products/${p._id}/edit`}>
              Modifier
            </Link>
          </div>
        ))}

        {products.length === 0 && (
          <p className="py-10 text-center font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/30">Aucun produit</p>
        )}
      </div>

      <button className="admin-fab" onClick={() => navigate('/admin/products/new')}>+</button>
    </section>
  )
}

export default AdminProducts
