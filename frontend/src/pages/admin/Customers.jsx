import { useEffect, useState } from 'react'
import { adminService } from '../../services/admin.service'

const Customers = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    adminService.getUsers().then(({ data }) => setUsers(data.data.users || [])).catch(() => {})
  }, [])
  return (
    <section>
      <div className="admin-table-wrapper border border-[0.5px] border-[rgba(201,168,76,0.22)]">
        <div className="grid min-w-[760px] grid-cols-[1fr_1fr_100px_120px_120px] bg-dark3 px-4 py-3 font-josefin text-[8px] uppercase tracking-[0.12em] text-[rgba(255,255,255,0.45)]">
          <span>Client</span><span className="admin-col-hide-mobile">Email</span><span>Commandes</span><span>Total</span><span>Actions</span>
        </div>
        {users.map((u) => (
          <div key={u._id} className="grid min-w-[760px] grid-cols-[1fr_1fr_100px_120px_120px] border-t border-[0.5px] border-[rgba(255,255,255,0.1)] px-4 py-3">
            <p>{u.firstName} {u.lastName}<span className="block text-xs text-[rgba(255,255,255,0.45)]">{u.phone}</span></p>
            <p className="admin-col-hide-mobile text-[rgba(255,255,255,0.45)]">{u.email}</p>
            <p>{u.orderCount || 0}</p>
            <p className="font-cormorant text-lg text-gold">{Math.round(u.totalSpent || 0)} TND</p>
            <a className="font-josefin text-[8px] uppercase tracking-[0.12em] text-gold" href={`https://wa.me/${(u.phone || '').replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Customers
