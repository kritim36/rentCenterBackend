const Product = require("../../../model/productModel")

exports.createProduct = async (req,res)=>{
    const file = req.file
    let filePath
    if(!file){
        filePath = "https://hips.hearstapps.com/hmg-prod/images/dw-burnett-pcoty22-8260-1671143390.jpg?crop=0.668xw:1.00xh;0.184xw,0&resize=640:*"
    }else{
        filePath = req.file.filename
    }
    const{productName,productDescription,productStockQty,productStatus,productPrice} = req.body
    if(!productName || !productDescription || !productStockQty || !productStatus || !productPrice){
    return res.status(400).json({
            message : "Please provide productName, productDescription, productStockQty, productStatus, productPrice"
        })
    }

    await Product.create({
        productName,
        productDescription,
        productStockQty,
        productPrice,
        productStatus,
        productImage : process.env.BACKEND_URL + filePath
    })

    res.status(200).json({
        message : "Product Created sucessfully"
    })
}

exports.getProducts = async(req,res)=>{
    const products = await Product.find()
    if(products.length == 0){
        res.status(400).json({
            message : "No products found",
            products : []
        })
    }else{
        res.status(200).json({
            message : "Product Fetched sucessfully",
            products
        })
    }
}

exports.getProduct = async(req,res)=>{
    const{id} = req.params
    if(!id){
        res.status(400).json({
            message : "Please provide id(productid)"
        })
    }

    const product = await Product.find({_id : id})
    if(product.length == 0){
        res.status(400).json({
            message : "No product found with that id",
            product : []
        })
    }else{
        res.status(200).json({
            message : "single Product fetched sucessfully",
            product
        })
    }
}