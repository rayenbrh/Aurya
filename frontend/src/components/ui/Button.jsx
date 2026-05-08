import { motion } from 'framer-motion'

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-dm font-medium transition-colors rounded-btn select-none disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary: 'bg-rust text-white hover:bg-espresso px-6 py-3 text-[13px]',
    gold: 'bg-gold text-white hover:bg-rust px-6 py-3 text-[13px] uppercase tracking-[0.1em]',
    ghost:
      'border-[1.5px] border-gold text-gold hover:bg-[rgba(168,138,83,0.08)] px-6 py-3 text-[13px] uppercase tracking-[0.08em] bg-transparent',
    outline: 'border border-espresso/20 text-espresso hover:bg-espresso/5 px-6 py-3 text-[13px]',
    pill: 'bg-rust text-white hover:bg-espresso rounded-pill px-6 py-2.5 text-[13px]',
  }

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
