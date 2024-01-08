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
    //check if the productId already exist or not, if exist increase the quantity of product else add the product to cart
    const existingCartItem = user.cart.find((item)=>item.product.equals(productId))
    if(existingCartItem){
        existingCartItem.quantity += 1;
    }else{
        user.cart.push({
            product : productId,
            quantity : 1
        })
    }
    await user.save()
    const updatedUser = await User.findById(userId).populate('cart.product')
    res.status(200).json({
        message : "Product added to cart",
        data : updatedUser.cart
    })
}

exports.getMyCartItems = async(req,res)=>{
    const userId = req.user.id
    const userData = await User.findById(userId).populate({
        path : "cart.product",
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
    user.cart = user.cart.filter(item=> item.product != productId) // [1,2,3] ==> 2 ==>fiter ==> [1,3] ==> user.cart = [1,3]
    await user.save()
    res.status(200).json({
        message : "Item deleted from cart"
    })
}

exports.updateCartItems = async(req,res)=>{
    const userId = req.user.id
    const {productId} = req.params 
    const {quantity} = req.body 

    const user = await User.findById(userId)
    console.log(user)
    const cartItem = user.cart.find((item)=>item.product.equals(productId))
    if(!cartItem){
        return res.status(404).json({
            message : "No item with that Id"
        })
    }

    cartItem.quantity = quantity ;
    await user.save()

    res.status(200).json({
        message : "Item updated successfully",
        data : user.cart
    })
}