const Product = require("../../model/productModel")
const Review = require("../../model/reviewModel")
const Host = require('../../model/hostModel')


exports.getProducts = async(req,res)=>{
    const products = await Product.find()
const approvedProduct= await Host.find({approved:true})

    if(products.length == 0 ){
        res.status(400).json({
            message : "No product Found",
           data : []
        })
    }else{
        approvedProduct.forEach((approved_product) => {
            products.push(approved_product)
        })
        
        res.status(200).json({
            message : "Products Fetched Successfully",
            data : products
        })
    }
    
    // else{
    //     res.status(200).json({
    //         message : "Products Fetched Successfully",
    //         data : products , 
    //         data2 : approvedProduct
    //     })
    // }
   
}


exports.getProduct = async(req ,res)=>{

        const {id} = req.params
    if(!id){
        return res.status(400).json({
            message : "Please provide id(productId)"
        })
    }
    const product = await Product.find({_id : id})
    const productReviews = await Review.find({productId :id }).populate("userId")
    if(product.length == 0){
        res.status(400).json({
            message : "No product found with that id",
          data : {  
            data : [],
            data2 : []
        }
        })
    }else{
        res.status(200).json({
            message : "Product fetched successfully",
            data : { 
                product ,
                productReviews
             }
        })
    }
 
}