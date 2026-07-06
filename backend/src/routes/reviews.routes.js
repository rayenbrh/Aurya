import { Router } from 'express'
import { createReview, getApprovedReviews } from '../controllers/reviews.controller.js'

const router = Router()

router.get('/', getApprovedReviews)
router.post('/', createReview)

export default router
