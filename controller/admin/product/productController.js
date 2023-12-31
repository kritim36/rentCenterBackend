const Product = require("../../../model/productModel")
const fs = require("fs")

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


exports.editProduct = async(req,res)=>{
    const{id} = req.params
    const{productName,productDescription,productStockQty,productStatus,productPrice} = req.body
    if(!productName || !productDescription || !productStockQty || !productStatus || !productPrice || !id){
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