import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import RequireAuth from './components/guards/RequireAuth'
import RequireAdmin from './components/guards/RequireAdmin'
import { toastTheme } from './components/ui/Toast'

const Home = lazy(() => import('./pages/Home'))
const Collections = lazy(() => import('./pages/Collections'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const SignUp = lazy(() => import('./pages/SignUp'))
const SignIn = lazy(() => import('./pages/SignIn'))
const Account = lazy(() => import('./pages/Account'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Orders = lazy(() => import('./pages/admin/Orders'))
const OrderDetail = lazy(() => import('./pages/admin/OrderDetail'))
const AdminProducts = lazy(() => import('./pages/admin/Products'))
const ProductForm = lazy(() => import('./pages/admin/ProductForm'))
const Categories = lazy(() => import('./pages/admin/Categories'))
const Customers = lazy(() => import('./pages/admin/Customers'))
const Analytics = lazy(() => import('./pages/admin/Analytics'))
const Settings = lazy(() => import('./pages/admin/Settings'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const Checkout = lazy(() => import('./pages/Checkout'))

function Loading() {
  const location = useLocation()
  return (
    <div className="grid min-h-screen place-items-center bg-parchment">
      <motion.p
        key={location.pathname}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="font-cormorant text-[32px] italic text-rust"
      >
        Aurya
      </motion.p>
    </div>
  )
}

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-parchment pt-20 text-center">
      <p className="font-cormorant text-7xl text-gold">404</p>
      <p className="mt-2 font-dm text-sm text-espresso/50">Page introuvable</p>
    </div>
  )
}

function AppRoutes() {
  const toastPosition = typeof window !== 'undefined' && window.innerWidth < 768 ? 'bottom-center' : 'bottom-right'

  return (
    <>
      <Toaster position={toastPosition} toastOptions={{ duration: 3000, ...toastTheme }} />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/univers" element={<Navigate to="/a-propos" replace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/commande" element={<Checkout />} />
            <Route path="/compte" element={<RequireAuth><Account /></RequireAuth>} />
            <Route path="/suivi" element={<OrderTracking />} />
            <Route path="/suivi/:orderNumber" element={<OrderTracking />} />
          </Route>
          <Route path="/connexion" element={<SignIn />} />
          <Route path="/inscription" element={<SignUp />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="customers" element={<Customers />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
