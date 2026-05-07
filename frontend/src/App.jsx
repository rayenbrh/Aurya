import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import LogoMark from './components/ui/LogoMark'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import RequireAuth from './components/guards/RequireAuth'
import RequireAdmin from './components/guards/RequireAdmin'

const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
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

const Loading = () => <div className="grid min-h-screen place-items-center bg-obsidian"><motion.div animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ duration: 1.5, repeat: Infinity }}><LogoMark size={52} /></motion.div></div>
const NotFound = () => <div className="grid min-h-screen place-items-center pt-16 text-center"><div><p className="font-cormorant text-[80px] text-gold">404</p><p className="font-josefin text-[10px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.45)]">Page introuvable</p></div></div>

const App = () => {
  const toastPosition = window.innerWidth < 768 ? 'bottom-center' : 'bottom-right'
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster
            position={toastPosition}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#181818',
              color: 'rgba(255,255,255,0.92)',
              border: '0.5px solid rgba(201,168,76,0.3)',
              borderRadius: '0px',
              padding: '12px 20px',
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            },
            iconTheme: { primary: '#C9A84C', secondary: '#181818' },
          }}
        />
          <Suspense fallback={<Loading />}>
            <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Products />} />
              <Route path="/univers" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/connexion" element={<SignIn />} />
              <Route path="/inscription" element={<SignUp />} />
              <Route path="/suivi/:orderNumber" element={<OrderTracking />} />
              <Route path="/compte" element={<RequireAuth><Account /></RequireAuth>} />
            </Route>
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
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
