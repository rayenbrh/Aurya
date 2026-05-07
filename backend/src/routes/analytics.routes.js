import { Router } from 'express'
import { customers, ordersByStatus, revenue, summary, topProducts } from '../controllers/analytics.controller.js'

const router = Router()

router.get('/summary', summary)
router.get('/revenue', revenue)
router.get('/orders-by-status', ordersByStatus)
router.get('/top-products', topProducts)
router.get('/customers', customers)

export default router
