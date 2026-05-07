import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const SectionReveal = ({ children, delay = 0, direction = 'up', distance = 36, className = '' }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.12 })
  const reduce = useReducedMotion()
  const hidden = direction === 'left' ? { x: -distance, opacity: 0 } : direction === 'right' ? { x: distance, opacity: 0 } : { y: distance, opacity: 0 }
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : hidden}
      animate={inView || reduce ? { x: 0, y: 0, opacity: 1 } : hidden}
      transition={{ duration: reduce ? 0 : 0.75, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default SectionReveal
