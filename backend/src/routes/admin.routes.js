import { Router } from 'express'
import {
  createAdminProduct,
  createCategory,
  cleanupOrphanUploads,
  deleteCategory,
  getAdminCategories,
  getAdminOrderById,
  getAdminOrders,
  getAdminProducts,
  getUserById,
  getUsers,
  patchUserRole,
  reorderCategories,
  softDeleteProduct,
  toggleProduct,
  updateAdminProduct,
  updateCategory,
  updateOrderNotes,
  updateOrderStatus,
} from '../controllers/admin.controller.js'
import { adminOnly } from '../middleware/adminOnly.middleware.js'
import {
  getSettings,
  patchContact,
  patchHeroImage,
  patchHeroText,
  patchMarquee,
  patchSeo,
} from '../controllers/settings.controller.js'
import { upload, withUploadFolder } from '../utils/upload.utils.js'
import analyticsRoutes from './analytics.routes.js'

const router = Router()
router.use(adminOnly)

router.get('/products', getAdminProducts)
router.post('/products', withUploadFolder('products'), upload.array('images', 4), createAdminProduct)
router.patch('/products/:id', withUploadFolder('products'), upload.array('images', 4), updateAdminProduct)
router.delete('/products/:id', softDeleteProduct)
router.patch('/products/:id/toggle', toggleProduct)

router.get('/categories', getAdminCategories)
router.post('/categories', createCategory)
router.patch('/categories/:id', updateCategory)
router.delete('/categories/:id', deleteCategory)
router.patch('/categories/reorder', reorderCategories)

router.get('/orders', getAdminOrders)
router.get('/orders/:id', getAdminOrderById)
router.patch('/orders/:id/status', updateOrderStatus)
router.patch('/orders/:id/notes', updateOrderNotes)

router.get('/users', getUsers)
router.get('/users/:id', getUserById)
router.patch('/users/:id/role', patchUserRole)
router.post('/uploads/cleanup', cleanupOrphanUploads)

router.get('/settings', getSettings)
router.patch('/settings/hero/text', patchHeroText)
router.patch('/settings/hero/image', withUploadFolder('hero'), upload.single('heroImage'), patchHeroImage)
router.patch('/settings/marquee', patchMarquee)
router.patch('/settings/contact', patchContact)
router.patch('/settings/seo', patchSeo)

router.use('/analytics', analyticsRoutes)

export default router
