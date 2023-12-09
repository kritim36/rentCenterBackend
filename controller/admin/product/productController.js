const Product = require("../../../model/productModel")

exports.createProduct = async (req,res)=>{
    const{productName,productDescription,productStockQty,productStatus,productPrice} = req.body
    if(!productName || !productDescription || !productStockQty || !productStatus || !productPrice){
    return res.status(400).json({
            message : "Please provide productName, productDescription, productStockQty, productStatus, productPrice"
        })
    }

    Product.create({
        productName,
        productDescription,
        productStockQty,
        productPrice,
        productStatus
    })

    res.status(200).json({
        message : "Product Created sucessfully"
    })
}