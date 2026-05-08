import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function SectionReveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion()
  const { ref, inView } = useInView({ threshold: 0.12, triggerOnce: true })

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
