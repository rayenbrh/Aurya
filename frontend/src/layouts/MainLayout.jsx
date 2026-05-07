import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CartDrawer from '../components/ui/CartDrawer'

const MainLayout = () => {
  const [cartOpen, setCartOpen] = useState(false)
  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <Outlet />
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

export default MainLayout
