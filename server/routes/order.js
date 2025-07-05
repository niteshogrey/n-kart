import express from 'express'
import { createOrder, createTransaction, getOrdersByUserId } from '../controllers/orderController.js'

const router = express.Router()

router.post('/create-transaction', createTransaction)
router.post('/create-order', createOrder),
router.post('/:userId', getOrdersByUserId);

export default router