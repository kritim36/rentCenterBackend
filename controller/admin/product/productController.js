const Order = require("../../../model/orderSchema")
const Product = require("../../../model/productModel")
const fs = require("fs")
const Renter = require("../../../model/renterModel")

exports.createProduct = async (req,res)=>{
    const file = req.file
    const id= req._id;
    let filePath
    if(!file){
        filePath = "https://hips.hearstapps.com/hmg-prod/images/dw-burnett-pcoty22-8260-1671143390.jpg?crop=0.668xw:1.00xh;0.184xw,0&resize=640:*"
    }else{
        filePath = req.file.filename
    }
    const{productBrand,productCategory,productName,productDescription,productStockQty,productStatus,productPrice} = req.body
    if(!productBrand || !productCategory ||!productName || !productDescription || !productStockQty || !productStatus || !productPrice){
    return res.status(400).json({
            message : "Please provide productBrand, productCategory, productName, productDescription, productStockQty, productStatus, productPrice"
        })
    }

    const productCreated = await Product.create({
        productOwner:id,
        productBrand,
        productCategory,
        productName,
        productDescription,
        productStockQty,
        productPrice,
        productStatus,
        productImage : process.env.BACKEND_URL + filePath
    })

    res.status(200).json({
        message : "Product Created sucessfully",
         data : productCreated
    })
}


exports.editProduct = async(req,res)=>{
    const{id} = req.params
    const{productBrand,productCategory,productName,productDescription,productStockQty,productStatus,productPrice} = req.body
    if(!productBrand || !productCategory || !productName || !productDescription || !productStockQty || !productStatus || !productPrice || !id){
    return res.status(400).json({
            message : "Please provide productName, productDescription, productStockQty, productStatus, productPrice, id"
        })
    }
    const oldData = await Product.findById(id)
    if(!oldData){
       return res.status(404).json({
            message : "No data found with that id"
        })
    }
    
    
    const oldProductImage = oldData.productImage //"http://localhost:3000/1702196095401-image.jpg"
    const lengthToCut = process.env.BACKEND_URL.length
    const finalFilePathAfterCut = oldProductImage.slice(lengthToCut) //"1702196095401-image.jpg"

    if(req.file && req.file.filename){
        // REMOVE FILE FROM UPLOADS FOLDER
            fs.unlink("./uploads/" +  finalFilePathAfterCut,(err)=>{
                if(err){
                    console.log("error deleting file",err) 
                }else{
                    console.log("file deleted successfully")
                }
            })
    }
    const datas =  await Product.findByIdAndUpdate(id,{
        productBrand,
        productCategory,
        productName ,
        productDescription ,
        productPrice,
        productStatus,
        productStockQty,
        productImage : req.file && req.file.filename ? process.env.BACKEND_URL +  req.file.filename :  oldProductImage
    },{
        new : true,
    
    })

    res.status(200).json({
        message : "Product updated sucessfully",
        data : datas
    })
}

exports.deleteProduct = async(req,res)=>{
    const{id} = req.params
    if(!id){
        return res.status(404).json({
            message : "Please provide id"
        })
    }
    const oldData = await Product.findById(id)
    if(!oldData){
        return res.status(404).json({
            message : "No data found with that id"
        })
    }
 
    const oldProductImage = oldData.productImage // http://localhost:3000/1698943267271-bunImage.png"
    const lengthToCut  = process.env.BACKEND_URL.length
    const finalFilePathAfterCut = oldProductImage.slice(lengthToCut) 
         // REMOVE FILE FROM UPLOADS FOLDER
            fs.unlink("./uploads/" +  finalFilePathAfterCut,(err)=>{
                if(err){
                    console.log("error deleting file",err) 
                }else{
                    console.log("file deleted successfully")
                }
            })

    await Product.findByIdAndDelete(id)
    res.status(200).json({
        message : "Product deleted sucessfully"
    })
}

exports.updateProductStatus = async(req,res)=>{
    const {id} = req.params 
    const {productStatus} = req.body 

    if(!productStatus || !['available','unavailable'].includes(productStatus.toLowerCase())){
        return res.status(400).json({
            message : "productStatus is invalid or should be provided"
        })
    }
    const product= await Product.findById(id)
    if(!product){
        return res.status(404).json({
            message : "No product found with that id"
        })
    }
    const updatedProduct = await Product.findByIdAndUpdate(id,{
          productStatus
    },{new:true})

    res.status(200).json({
        message : "product status updated Successfully",
        data : updatedProduct
    })
}

exports.updateProductStockAndPrice =  async(req,res)=>{
    const {id} = req.params 
    const {productStockQty,productPrice} = req.body 

    if(!productStockQty && !productPrice){
        return res.status(400).json({
            message : "Please provide productStockQty or productPrice"
        })
    }
    const product= await Product.findById(id)
    if(!product){
        return res.status(404).json({
            message : "No product found with that id"
        })
    }
    const updatedProduct = await Product.findByIdAndUpdate(id,{
        productStockQty : productStockQty ? productStockQty : product.productStockQty,
        productPrice : productPrice ? productPrice : product.productPrice
    },{new:true})

    res.status(200).json({
        message : "product status updated Successfully",
        data : updatedProduct
    })
}

exports.getOrdersOfAProduct = async(req,res)=>{
    const {id:productId} = req.params

    // check if this productExist or not 
    const product = await Product.findById(productId)
    if(!product ){
       return res.status(400).json({
            message : "No product Found"
        })
    }
    const orders = await Order.find({'items.product' : productId})
    
    res.status(200).json({
        message : "Product ORdres fetched",
        data : orders
    })
}




exports.getApprovedrenters = async(req,res)=>{
    const approveRenter = await Renter.find({approved : true})
    if(!approveRenter){
        return res.status(400).json({
            message : "No approveRenter"
        })
    }
    res.status(200).json({
        message : "Renter product fetched",
    })
}


  