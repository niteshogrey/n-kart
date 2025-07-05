import express from 'express'
import { getAllCategory } from '../controllers/categoryController.js'

const router = express.Router()

router.get('/', getAllCategory)

export default router