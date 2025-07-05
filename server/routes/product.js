import express from 'express'
import { getProductsByCategoryId } from '../controllers/productController.js'

const router = express.Router()

router.get('/:category', getProductsByCategoryId)

export default router