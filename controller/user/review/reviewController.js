const Product = require("../../../model/productModel")
const Review = require("../../../model/reviewModel")

exports.createReview = async(req,res)=>{
    const userId = req.user.id
    const productId = req.params.id
    const{rating,message} = req.body

    if(!rating || !message || !productId){
       return res.status(400).json({
            message : "Please provide rating, message, productId"
        })
    }

    //check if that productId product exist or not
    const productExist = await Product.findById(productId)
    if(!productExist){
        return res.status(400).json({
            message : "Product with that productId doesnot exist"
        })
    }
    await Review.create({
        userId,
        productId,
        rating,
        message
    })
    res.status(200).json({
        message : "Review created sucessfully"
    })
}


exports.getMyReviews = async(req,res)=>{
    const userId = req.user.id  
    const reviews = await Review.find({userId})
    if(reviews.length == 0 ){
        res.status(404).json({
            message : "You haven't given review to any products yet",
            reviews : []
        })
    }else{
        res.status(200).json({
            message : "Review fetched successfully",
           data :  reviews
        })
    }
}

exports.deleteReview = async(req,res)=>{
    const reviewId   = req.params.id 
    // check if that user created this review 
    const userId = req.user.id 
    if(!reviewId){
        res.status(400).json({
            message : "Please provide reviewId "
        })
    }
    const review = Review.findById(reviewId)
    const ownerIdOfReview = review.userId 
    if(ownerIdOfReview !== userId){
        return res.status(400).json({
            message : "You don't have permission to delete this review"
        })
    } 

 
    await Review.findByIdAndDelete(reviewId)
    res.status(200).json({
        message : "Review delete successfully"
    })

}