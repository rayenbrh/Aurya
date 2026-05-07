import { Router } from 'express'
import { createOrder, myOrders, trackOrder } from '../controllers/orders.controller.js'
import { optionalAuth, requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/', optionalAuth, createOrder)
router.get('/track/:orderNumber', trackOrder)
router.get('/my', requireAuth, myOrders)

export default router
