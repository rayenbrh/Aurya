import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiShoppingBag, FiEdit2, FiCheck, FiX, FiPackage, FiClock, FiTruck, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ordersService } from '../services/orders.service'

const statusConfig = {
  pending:    { label: 'En attente',  Icon: FiClock,       color: 'text-olive bg-olive-pale' },
  confirmed:  { label: 'Confirmée',   Icon: FiCheck,       color: 'text-sage bg-sage/10' },
  shipped:    { label: 'Expédiée',    Icon: FiTruck,       color: 'text-bark bg-bark/10' },
  delivered:  { label: 'Livrée',      Icon: FiCheckCircle, color: 'text-sage-dark bg-sage/10' },
  cancelled:  { label: 'Annulée',     Icon: FiX,           color: 'text-stone bg-nude/60' },
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.pending
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 font-josefin text-[8px] uppercase tracking-[0.18em] ${cfg.color}`}>
      <cfg.Icon size={10} />
      {cfg.label}
    </span>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersService.myOrders()
      .then(({ data }) => setOrders(data?.data?.orders || data?.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-bark border-t-transparent" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-parchment">
          <FiPackage size={28} className="text-bark/30" />
        </div>
        <p className="font-cormorant text-2xl font-light text-ink">Aucune commande</p>
        <p className="mt-2 text-[13px] text-stone">Vos futures commandes apparaîtront ici.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order, i) => (
        <motion.div
          key={order._id || i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-card border border-nude/60 bg-parchment p-5 md:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/55">Commande</p>
              <p className="mt-0.5 font-cormorant text-lg font-light text-ink">#{order.orderNumber || order._id?.slice(-6).toUpperCase()}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="mt-4 space-y-2">
            {(order.items || []).map((item, j) => (
              <div key={j} className="flex items-center justify-between text-[13px]">
                <span className="text-stone">{item.name || item.product?.name} × {item.quantity}</span>
                <span className="font-cormorant text-[15px] text-olive">{((item.price || 0) * item.quantity).toLocaleString('fr-TN')} TND</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-nude/60 pt-4">
            <span className="font-josefin text-[8px] uppercase tracking-[0.18em] text-stone/60">
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            </span>
            <span className="font-cormorant text-[20px] font-light text-ink">{(order.total || 0).toLocaleString('fr-TN')} TND</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function ProfileTab({ user }) {
  const { setUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: user.firstName || '',
    lastName:  user.lastName  || '',
    phone:     user.phone     || '',
    address: {
      street: user.address?.street || '',
      city:   user.address?.city   || 'Tunis',
      region: user.address?.region || '',
    },
  })

  const save = async (e) => {
    e.preventDefault()
    try {
      const { authService } = await import('../services/auth.service')
      const { data } = await authService.updateMe(form)
      setUser(data.data)
      setEditing(false)
      toast.success('Profil mis à jour')
    } catch {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const field = (label, key, type = 'text') => (
    <label key={key} className="block">
      <span className="mb-2 block font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/55">{label}</span>
      {editing ? (
        <input
          type={type}
          value={key.includes('.') ? form.address[key.split('.')[1]] : form[key]}
          onChange={(e) => {
            if (key.includes('.')) {
              const subKey = key.split('.')[1]
              setForm((f) => ({ ...f, address: { ...f.address, [subKey]: e.target.value } }))
            } else {
              setForm((f) => ({ ...f, [key]: e.target.value }))
            }
          }}
          className="w-full border-0 border-b border-nude/80 bg-transparent pb-2 font-cormorant text-[16px] text-ink outline-none transition-colors focus:border-bark"
        />
      ) : (
        <p className="border-b border-nude/40 pb-2 font-cormorant text-[16px] font-light text-ink">
          {(key.includes('.') ? user.address?.[key.split('.')[1]] : user[key]) || <span className="text-stone/40">—</span>}
        </p>
      )}
    </label>
  )

  return (
    <form onSubmit={save}>
      <div className="mb-6 flex items-center justify-between">
        <p className="eyebrow">Informations personnelles</p>
        {!editing ? (
          <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 font-josefin text-[9px] uppercase tracking-[0.2em] text-bark transition-colors hover:text-ink">
            <FiEdit2 size={12} /> Modifier
          </button>
        ) : (
          <div className="flex gap-3">
            <button type="button" onClick={() => setEditing(false)} className="font-josefin text-[9px] uppercase tracking-[0.2em] text-stone hover:text-ink">
              Annuler
            </button>
            <button type="submit" className="btn-bark px-4 py-2 text-[8px]">
              <FiCheck size={11} /> Enregistrer
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {field('Prénom', 'firstName')}
        {field('Nom', 'lastName')}
        {field('Téléphone', 'phone', 'tel')}
      </div>

      <p className="eyebrow mb-5 mt-8">Adresse de livraison</p>
      <div className="grid gap-5 md:grid-cols-2">
        {field('Rue', 'address.street')}
        {field('Ville', 'address.city')}
        {field('Région', 'address.region')}
      </div>

      <div className="mt-8 rounded-card border border-nude/60 bg-parchment p-5">
        <p className="font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/55 mb-2">Email</p>
        <p className="font-cormorant text-[16px] font-light text-stone">{user.email}</p>
        <p className="mt-1 font-josefin text-[8px] text-stone/40">L&apos;email ne peut pas être modifié</p>
      </div>
    </form>
  )
}

export default function Account() {
  const { user } = useAuth()
  const [tab, setTab] = useState('profile')

  if (!user) return <Navigate to="/connexion" replace />

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'AD'

  return (
    <main className="min-h-screen bg-cream pt-[60px] md:pt-[72px]">
      <div className="mx-auto max-w-5xl px-5 py-12 md:px-10 md:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-[240px]">
            <div className="rounded-card border border-nude/60 bg-parchment p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3 pb-6 border-b border-nude/60">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-nude font-josefin text-[18px] tracking-wider text-bark border border-nude">
                  {initials}
                </div>
                <div className="text-center">
                  <p className="font-cormorant text-xl font-light text-ink">{user.firstName} {user.lastName}</p>
                  <p className="mt-0.5 font-josefin text-[8px] uppercase tracking-[0.16em] text-stone/55">{user.role === 'admin' ? 'Administrateur' : 'Client'}</p>
                </div>
              </div>

              {/* Nav */}
              <nav className="mt-4 space-y-1">
                {[
                  { key: 'profile', label: 'Mon profil',   Icon: FiUser },
                  { key: 'orders',  label: 'Mes commandes', Icon: FiShoppingBag },
                ].map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`flex w-full items-center gap-3 rounded-card px-4 py-3 transition-colors ${
                      tab === key
                        ? 'bg-bark text-cream'
                        : 'text-stone hover:bg-nude/50 hover:text-ink'
                    }`}
                  >
                    <Icon size={14} />
                    <span className="font-josefin text-[9px] uppercase tracking-[0.18em]">{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <section className="min-w-0 flex-1 rounded-card border border-nude/60 bg-parchment p-6 md:p-8">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {tab === 'profile' && <ProfileTab user={user} />}
              {tab === 'orders'  && <OrdersTab />}
            </motion.div>
          </section>

        </div>
      </div>
    </main>
  )
}
