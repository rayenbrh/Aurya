import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function CategoryCard({ category, panelColor, patternOverlay }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      whileHover={reduce ? {} : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="overflow-hidden rounded-card border border-nude/60 bg-parchment shadow-soft transition-shadow hover:shadow-card"
    >
      <Link to={`/collections?cat=${category.slug}`} className="block">
        <div
          className="relative h-[200px] overflow-hidden"
          style={{
            backgroundColor: panelColor || '#D4C4B5',
            backgroundImage: patternOverlay
              ? 'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(123,79,58,0.06) 12px, rgba(123,79,58,0.06) 13px)'
              : undefined,
          }}
        >
          <p className="pointer-events-none absolute inset-0 grid place-items-center text-center font-cormorant text-[52px] font-light leading-none text-bark/[0.1] select-none">
            {category.name}
          </p>
        </div>
        <div className="flex items-start justify-between gap-3 px-6 py-5">
          <div>
            <p className="font-cormorant text-[18px] font-light text-ink">{category.name}</p>
            <p className="mt-1 font-josefin text-[8px] uppercase tracking-[0.18em] text-stone/55">{category.tagline}</p>
          </div>
          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-nude/80 text-stone transition-colors hover:border-bark hover:text-bark">
            <FiArrowRight size={13} aria-hidden />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
