import { Router } from 'express'
import { getCategoriesAll, getProductBySlug, getProducts } from '../controllers/products.controller.js'

const router = Router()

router.get('/', getProducts)
router.get('/categories/all', getCategoriesAll)
router.get('/:slug', getProductBySlug)

export default router
