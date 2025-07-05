import Razorpay from 'razorpay'
import crypto from 'crypto'
import Transaction from '../models/transaction.js'
import Order from '../models/order.js'

const createTransaction = async(req, res) =>{
    const {amount, userId} = req.body
    const razorpay = new Razorpay({
        key_id: process.env.RAZOR_PAY_KEY_ID,
        key_secret: process.env.RAZOR_PAY_SECRET
    })

    const options = {
        amount: amount,
        currency: 'INR',
        receipt: `receipt#${Date.now()}`
    }
    try {
        if (!amount || !userId) {
            res.status(400).json({
                success: false,
                message: "amount and user Id required"
            })
           
        } 
        const razorpayOrder = await razorpay.orders.create(options)
        res.status(201).json({
            success: true,
            message: "Order Created successfully",
            key: process.env.RAZOR_PAY_KEY_ID,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            order_id: razorpayOrder.id
        })
    } catch (error) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Failed to create Order',
            error: err.message
        })
    }
}

const createOrder = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userId,
        cartItems,
        deliveryDate,
        address
    }= req.body
    const key_secrete = process.env.RAZOR_PAY_SECRET

    const generated_signature = crypto.createHmac('sha256', key_secrete)
    .update( razorpay_order_id + " | "+ razorpay_payment_id)
    .digest('hex')

    if (generated_signature === razorpay_signature) {
        try {
            const transaction = await Transaction.create({
                user: userId,
                orderId : razorpay_order_id,
                paymentId: razorpay_payment_id,
                status:"Success",
                amount : cartItems.reduce((total, item)=> total = item?.quantity * item.price, 0
                )
            })
             const order = await Order.create({
                user: userId,
                address, deliveryDate,
                items: cartItems?.map((item)=>({
                    product: item?._id,
                    quantity: item?.quantiy
                })),
                status: "Order Placed"
             })

             transaction.order = order._id;
             await transaction.save()
             res.json({
                succcess: true,
                message: "Payment Verified and order Created"
             })
        } catch (error) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Failed to create transaction or Order',
                error: err.message
            })
        }
    }
}

const getOrdersByUserId = async(req, res) =>{
    const {userId}  = req.body
    try {
        const orders = await Order.find({user: userId})
        .populate("user", "name", "email")
        .populate("items.product", "name", "price", "image_uri", "ar_uri")
        .sort({createdAt: -1})

        if (!orders || orders.length ===0 ) {
            return res.status(404).json({
                success: false,
                message: "No Orders found for this user"
            })
        }

        req.status(200).json({
            succcess: true,
            orders
        })
    } catch (error) {
        console.log(err);
            res.status(500).json({
                success: false,
                message: 'Failed to create transaction or Order',
                error: err.message
            })
    }
}
export {createTransaction, createOrder, getOrdersByUserId}