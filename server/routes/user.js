import express from 'express'
import loginOrSignup from '../controllers/userController.js'

const router = express.Router()

router.get("/get-data", (req, res)=>{
    res.status(200).json({
        success:true
    })
})

router.post('/login', loginOrSignup)

export default router