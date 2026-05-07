import { useState } from 'react'
import api from '../services/api'

const OrderTracking = () => {
  const [num, setNum] = useState('')
  const [order, setOrder] = useState(null)
  const [err, setErr] = useState('')
  const track = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const { data } = await api.get(`/orders/track/${num}`)
      setOrder(data.data)
    } catch {
      setErr('Commande introuvable')
    }
  }
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 pt-24">
      <div className="w-full max-w-xl border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-8">
        <h1 className="font-cormorant text-5xl">Suivi commande</h1>
        <form className="mt-6 flex gap-2" onSubmit={track}>
          <input value={num} onChange={(e) => setNum(e.target.value)} className="flex-1 border-0 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent py-3" placeholder="AD-2026-0001" />
          <button className="bg-gold px-4 font-josefin text-[9px] uppercase tracking-[0.2em] text-black">Suivre</button>
        </form>
        {err ? <p className="mt-3 text-[#C0392B]">{err}</p> : null}
        {order ? <div className="mt-4"><p>{order.orderNumber}</p><p className="font-josefin text-[9px] uppercase tracking-[0.12em] text-gold">{order.status}</p></div> : null}
      </div>
    </main>
  )
}

export default OrderTracking
