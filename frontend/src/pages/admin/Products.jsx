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
        <p className="font-josefin text-[11px] uppercase tracking-[0.2em]">Produits</p>
        <Link to="/admin/products/new" className="grid h-10 place-items-center bg-gold px-4 font-josefin text-[9px] uppercase tracking-[0.2em] text-black">+ Ajouter</Link>
      </div>
      <div className="admin-table-wrapper border border-[0.5px] border-[rgba(201,168,76,0.22)]">
        <div className="grid min-w-[760px] grid-cols-[1fr_120px_100px_90px_90px_120px_80px] bg-dark3 px-4 py-3 font-josefin text-[8px] uppercase tracking-[0.12em] text-[rgba(255,255,255,0.45)]">
          <span>Produit</span><span>Prix</span><span className="admin-col-hide-mobile">Stock</span><span className="admin-col-hide-mobile">Ventes</span><span>Statut</span><span>Catégorie</span><span>Actions</span>
        </div>
        {products.map((p) => (
          <div key={p._id} className="grid min-w-[760px] grid-cols-[1fr_120px_100px_90px_90px_120px_80px] border-t border-[0.5px] border-[rgba(255,255,255,0.1)] bg-dark2 px-4 py-3">
            <div>
              <p className="font-cormorant text-2xl">{p.name}</p>
              <p className="text-xs text-[rgba(255,255,255,0.45)]">{p.slug}</p>
            </div>
            <p className="font-cormorant text-xl text-gold">{Math.round(p.price)} TND</p>
            <p className="admin-col-hide-mobile">{p.stock ?? 0}</p>
            <p className="admin-col-hide-mobile">{p.orderCount ?? 0}</p>
            <span className="font-josefin text-[8px] uppercase tracking-[0.12em] text-gold">{p.isAvailable ? 'Actif' : 'Masqué'}</span>
            <span className="font-josefin text-[8px] uppercase tracking-[0.12em] text-[rgba(255,255,255,0.45)]">{p.category?.name || '-'}</span>
            <Link className="font-josefin text-[8px] uppercase tracking-[0.15em] text-gold" to={`/admin/products/${p._id}/edit`}>Modifier</Link>
          </div>
        ))}
      </div>
      <button className="admin-fab" onClick={() => navigate('/admin/products/new')}>+</button>
    </section>
  )
}

export default AdminProducts
