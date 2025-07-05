import jwt from "jsonwebtoken";
import User from "../models/user.js";

const generateTokens = (user) =>{
    const accessToken = jwt.sign(
        {userId: user?._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '2d'}
    )
    const refreshToken = jwt.sign(
        {userId: user?._id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'7d'}

    )
    return {accessToken ,refreshToken}
}

const loginOrSignup = async(req, res) =>{
    const {phone, address} = req.body
    try {
       let user = await User.findOne({phone}) 
       if (!user) {
        user = new User({address, phone})
        await user.save()
       } else {
        user.address = address;
        await user.save()
       }
       const {accessToken, refreshToken} = generateTokens(user.toObject())

       res.status(200).json({
        user,
        accessToken,
        refreshToken,
       })
    } catch (error) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}

export default loginOrSignup