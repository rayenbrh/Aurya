import { useEffect, useState } from 'react'

const StatCard = ({ label, value, suffix = '', icon = '✦' }) => {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const target = Number(value || 0)
    const animate = (t) => {
      const p = Math.min(1, (t - start) / 1400)
      setDisplay(Math.round(target * p))
      if (p < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return (
    <article className="border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-6">
      <p className="mb-3 font-josefin text-[8px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.45)]">{icon} {label}</p>
      <p className="font-cormorant text-4xl text-gold">{display}{suffix}</p>
    </article>
  )
}

export default StatCard
