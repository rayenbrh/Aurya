import { motion, useReducedMotion } from 'framer-motion'

const PageTransition = ({ children }) => {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1 }}
      exit={reduce ? { opacity: 1 } : { opacity: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
