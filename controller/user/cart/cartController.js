const Product = require("../../../model/productModel")
const User = require("../../../model/userModel")

exports.addToCart = async(req,res)=>{
    const userId = req.user.id 
    const {productId} = req.params
    if(!productId){
        return res.status(400).json({
            message : "Please provide productId"
        })
    }
    const productExist = await Product.findById(productId)
    if(!productExist){
        return res.status(400).json({
            message : "No Product with that productId"
        })
    }
    const user = await User.findById(userId)
    user.cart.push(productId)
    await user.save()
    res.status(200).json({
        message : "Product added to cart"
    })
}

exports.getMyCartItems = async(req,res)=>{
    const userId = req.user.id
    const userData = await User.findById(userId).populate({
        path : "cart",
        select : "-productStatus"
    })

    res.status(200).json({
        message : "Cart item fetched sucessfully",
        data : userData.cart
    })
}

exports.deleteItemFromMyCart = async(req,res)=>{
    const userId = req.user.id
    const {productId} = req.params
    const product = await Product.findById(productId)
    if(!product){
        return res.status(400).json({
            message : "No product found"
        })
    }
    //get user cart
    const user = await User.findById(userId)
    user.cart = user.cart.filter((pId)=>pId != productId) // [1,2,3] ==> 2 ==>fiter ==> [1,3] ==> user.cart = [1,3]
    await user.save()
    res.status(200).json({
        message : "Item deleted from cart"
    })
}