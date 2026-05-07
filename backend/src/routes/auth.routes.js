import { Router } from 'express'
import { changePassword, login, logout, me, refresh, register, updateMe } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refresh)
router.get('/me', requireAuth, me)
router.patch('/me', requireAuth, updateMe)
router.patch('/me/password', requireAuth, changePassword)

export default router
