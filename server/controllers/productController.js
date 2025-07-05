import Product from "../models/product.js";

 const getProductsByCategoryId =async(req, res) =>{
    const {categoryId} = req.params
    try {
        const products  = await Product.find({category: categoryId})
        if (!products || products.length === 0) {
            res.status(404).json({
                success: false,
                message: "No products found for this category" 
            })
        } else {
            req.status(200).json({
                success: true,
                products
            })
        }
    } catch (error) {
        console.log(err);
        res.status(500).json({
            success: false,
            message:"Failes to retrieve Products",
            error: err.message
        })
    }
 }

 export {getProductsByCategoryId}