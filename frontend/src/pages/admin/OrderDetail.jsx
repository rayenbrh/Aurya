import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StatusBadge from '../../components/admin/StatusBadge'
import { adminService } from '../../services/admin.service'

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  useEffect(() => {
    adminService.getOrder(id).then(({ data }) => setOrder(data.data)).catch(() => {})
  }, [id])
  if (!order) return <section className="p-8">Chargement...</section>
  return (
    <section>
      <div className="mb-3 md:hidden">
        <Link to="/admin/orders" className="font-josefin text-[8px] uppercase tracking-[0.15em] text-gold">← Retour</Link>
      </div>
      <div className="mb-4 hidden md:block">
        <p className="font-josefin text-[8px] uppercase tracking-[0.15em] text-[rgba(255,255,255,0.45)]">
          <Link to="/admin/orders" className="text-gold">Commandes</Link> / {order.orderNumber}
        </p>
      </div>
      <div className="admin-two-col">
      <article className="border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-6 md:order-1 order-2">
        <h2 className="font-cormorant text-4xl text-gold">{order.orderNumber}</h2>
        <div className="mt-2"><StatusBadge status={order.status} /></div>
        <div className="mt-6 space-y-3">{order.items.map((i) => <div key={i.productName} className="flex items-center justify-between border-b border-[0.5px] border-[rgba(255,255,255,0.1)] pb-2"><p>{i.productName} × {i.quantity}</p><p className="font-cormorant text-gold">{Math.round(i.subtotal)} TND</p></div>)}</div>
      </article>
      <article className="border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-6 md:order-2 order-1">
        <p className="font-josefin text-[9px] uppercase tracking-[0.18em] text-gold">Client</p>
        <p className="mt-2">{order.customer?.fullName}</p>
        <p className="text-[rgba(255,255,255,0.45)]">{order.customer?.phone}</p>
      </article>
      </div>
    </section>
  )
}

export default OrderDetail
