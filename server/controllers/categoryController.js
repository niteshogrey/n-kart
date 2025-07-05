import Category from "../models/category.js";

const getAllCategory = async(req, res) =>{
    try {

        const categories = await Category.find()
        req.status(200).json({
            success: true,
            categories
        })
        
    } catch (error) {
        console.log(err);
        res.status(500).json({
            success: false,
            message:"Failes to retrieve Category",
            error: err.message
        })
    }
}

export {getAllCategory}