import { motion, useReducedMotion } from 'framer-motion'

const GoldCorner = ({ className = '' }) => {
  const reduce = useReducedMotion()
  return (
    <motion.svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      initial={reduce ? false : { opacity: 0 }}
      animate={reduce ? {} : { opacity: 1 }}
      transition={{ duration: 0.6 }}
      aria-hidden="true"
    >
      <motion.path
        d="M0 48V0H48"
        fill="none"
        stroke="rgba(201,168,76,0.75)"
        strokeWidth="0.5"
        strokeDasharray="200"
        initial={reduce ? false : { strokeDashoffset: 200 }}
        animate={reduce ? {} : { strokeDashoffset: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </motion.svg>
  )
}

export default GoldCorner
