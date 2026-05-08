import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CartDrawer from '../components/ui/CartDrawer'

export default function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-parchment">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
