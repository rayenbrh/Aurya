import { useEffect, useState } from 'react'
import { adminService } from '../../services/admin.service'

const Customers = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    adminService.getUsers().then(({ data }) => setUsers(data.data.users || [])).catch(() => {})
  }, [])

  return (
    <section>
      <div className="admin-table-wrapper border border-nude/60">
        <div className="grid min-w-[760px] grid-cols-[1fr_1fr_100px_120px_120px] bg-parchment px-4 py-3 font-josefin text-[8px] uppercase tracking-[0.12em] text-stone/50">
          <span>Client</span>
          <span className="admin-col-hide-mobile">Email</span>
          <span>Commandes</span>
          <span>Total</span>
          <span>Actions</span>
        </div>

        {users.map((u) => (
          <div key={u._id} className="grid min-w-[760px] grid-cols-[1fr_1fr_100px_120px_120px] border-t border-nude/40 px-4 py-3 transition-colors hover:bg-parchment/40">
            <p className="font-josefin text-[9px] text-ink">
              {u.firstName} {u.lastName}
              <span className="block text-stone/40">{u.phone}</span>
            </p>
            <p className="admin-col-hide-mobile font-josefin text-[9px] text-stone/50">{u.email}</p>
            <p className="font-josefin text-[9px] text-stone/60">{u.orderCount || 0}</p>
            <p className="font-cormorant text-lg text-bark">{Math.round(u.totalSpent || 0)} TND</p>
            <a
              className="font-josefin text-[8px] uppercase tracking-[0.12em] text-bark hover:text-ink"
              href={`https://wa.me/${(u.phone || '').replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        ))}

        {users.length === 0 && (
          <p className="py-10 text-center font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/30">Aucun client</p>
        )}
      </div>
    </section>
  )
}

export default Customers
