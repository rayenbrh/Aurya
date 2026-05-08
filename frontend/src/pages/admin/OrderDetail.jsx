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

  if (!order) return (
    <section className="grid min-h-[200px] place-items-center">
      <p className="font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/40">Chargement…</p>
    </section>
  )

  return (
    <section>
      <div className="mb-4">
        <p className="font-josefin text-[8px] uppercase tracking-[0.15em] text-stone/40">
          <Link to="/admin/orders" className="text-bark hover:text-ink">Commandes</Link>
          {' '}/ {order.orderNumber}
        </p>
      </div>

      <div className="admin-two-col">
        {/* Items */}
        <article className="order-2 border border-nude/60 bg-cream p-6 md:order-1">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="font-cormorant text-4xl text-bark">{order.orderNumber}</h2>
            <StatusBadge status={order.status} />
          </div>

          <p className="mb-3 font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/50">Articles</p>
          <div className="space-y-0">
            {order.items.map((i) => (
              <div key={i.productName} className="flex items-center justify-between border-b border-nude/40 py-3">
                <p className="font-josefin text-[10px] text-ink">
                  {i.productName}
                  <span className="text-stone/40"> × {i.quantity}</span>
                </p>
                <p className="font-cormorant text-lg text-bark">{Math.round(i.subtotal)} TND</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t border-nude/60 pt-4">
            <p className="font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50">Total</p>
            <p className="font-cormorant text-2xl text-bark">{Math.round(order.total)} TND</p>
          </div>
        </article>

        {/* Customer info */}
        <article className="order-1 border border-nude/60 bg-cream p-6 md:order-2">
          <p className="mb-4 font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/50">Client</p>
          <p className="font-cormorant text-2xl text-ink">{order.customer?.fullName}</p>
          <p className="mt-1 font-josefin text-[9px] text-stone/50">{order.customer?.phone}</p>
          {order.customer?.email && (
            <p className="mt-0.5 font-josefin text-[9px] text-stone/50">{order.customer?.email}</p>
          )}

          {order.address && (
            <>
              <p className="mt-6 mb-2 font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/50">Adresse</p>
              <p className="font-josefin text-[9px] text-ink leading-relaxed">
                {order.address.street}<br />
                {order.address.city}{order.address.region ? `, ${order.address.region}` : ''}
              </p>
            </>
          )}

          <p className="mt-6 mb-1 font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/50">Date</p>
          <p className="font-josefin text-[9px] text-ink">{new Date(order.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</p>
        </article>
      </div>
    </section>
  )
}

export default OrderDetail
