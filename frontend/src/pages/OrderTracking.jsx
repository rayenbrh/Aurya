import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiPhone } from 'react-icons/fi'
import api from '../services/api'

const STEPS = [
  { key: 'pending', label: 'Enregistrée' },
  { key: 'confirmed', label: 'Confirmée' },
  { key: 'preparing', label: 'Préparation' },
  { key: 'out_for_delivery', label: 'Expédition' },
  { key: 'delivered', label: 'Livrée' },
]

const idx = (status) => {
  const i = STEPS.findIndex((s) => s.key === status)
  return i >= 0 ? i : 0
}

export default function OrderTracking() {
  const { orderNumber: routeNum } = useParams()
  const [num, setNum] = useState(routeNum || '')
  const [order, setOrder] = useState(null)
  const [err, setErr] = useState('')

  const load = useCallback(async (code) => {
    setErr('')
    setOrder(null)
    try {
      const { data } = await api.get(`/orders/track/${encodeURIComponent(code)}`)
      setOrder(data.data)
    } catch {
      setErr('Commande introuvable')
    }
  }, [])

  useEffect(() => {
    if (routeNum) {
      setNum(routeNum)
      load(routeNum)
    }
  }, [routeNum, load])

  const active = order ? idx(order.status) : -1
  const cancelled = order?.status === 'cancelled'

  return (
    <main className="min-h-[70vh] bg-parchment px-5 pb-20 pt-[96px] md:px-8">
      <div className="mx-auto max-w-[600px] rounded-[20px] bg-white p-8 shadow-soft md:p-10">
        <h1 className="font-cormorant text-3xl font-light text-espresso">Suivi commande</h1>
        <a
          href="tel:+21693091290"
          className="mt-3 mb-1 inline-flex items-center gap-2 rounded-lg border border-rust/20 bg-rust/5 px-4 py-2 font-dm text-[12px] text-rust hover:bg-rust/10 transition-colors"
        >
          <FiPhone size={12} /> Support : +216 93 091 290
        </a>
        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!num.trim()) return
            await load(num.trim())
          }}
        >
          <input
            value={num}
            onChange={(e) => setNum(e.target.value)}
            placeholder="AD-2026-0001"
            className="flex-1 rounded-[8px] border border-rust/20 px-4 py-3 font-dm text-sm text-espresso outline-none focus:border-rust"
          />
          <button type="submit" className="rounded-[8px] bg-rust px-8 py-3 font-dm text-[13px] text-white hover:bg-espresso">
            Rechercher
          </button>
        </form>
        {err ? <p className="mt-4 font-dm text-sm text-error">{err}</p> : null}

        {order && !cancelled ? (
          <div className="mt-10">
            <div className="inline-block rounded-[8px] border border-rust/20 bg-rust/10 px-4 py-2 font-dm text-[13px] text-rust">{order.orderNumber}</div>
            <p className="mt-4 font-dm text-lg text-espresso">{order.customer?.fullName}</p>

            <div className="mt-10 hidden md:flex md:items-start md:justify-between md:gap-2">
              {STEPS.map((step, i) => {
                const past = i < active
                const act = i === active
                const future = i > active
                const circle = act
                  ? 'bg-rust border-rust text-white'
                  : past
                    ? 'bg-rust/15 border-rust/30 text-rust'
                    : 'bg-transparent border-rust/15 text-espresso/25'
                return (
                  <div key={step.key} className="relative flex flex-1 flex-col items-center">
                    {i > 0 ? (
                      <div
                        className="absolute left-0 top-5 hidden h-px w-1/2 -translate-x-1/2 md:block"
                        style={{ background: i <= active ? 'rgba(136,91,69,0.25)' : 'rgba(136,91,69,0.1)' }}
                      />
                    ) : null}
                    <div className={`relative z-[1] flex h-10 w-10 items-center justify-center rounded-full border-2 font-dm text-xs ${circle}`}>
                      {future ? i + 1 : '✓'}
                    </div>
                    <p className={`mt-3 text-center font-dm text-xs ${act ? 'text-rust' : past ? 'text-espresso/55' : 'text-espresso/25'}`}>{step.label}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex flex-col gap-4 md:hidden">
              {STEPS.map((step, i) => {
                const past = i < active
                const act = i === active
                const future = i > active
                const circle = act ? 'bg-rust border-rust text-white' : past ? 'bg-rust/15 border-rust/30 text-rust' : 'bg-transparent border-rust/15 text-espresso/25'
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-dm text-xs ${circle}`}>
                      {future ? i + 1 : '✓'}
                    </div>
                    <p className={`font-dm text-sm ${act ? 'text-rust font-medium' : 'text-espresso/55'}`}>{step.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        {order && cancelled ? <p className="mt-8 font-dm text-sm text-espresso/60">Cette commande a été annulée.</p> : null}
      </div>
    </main>
  )
}
