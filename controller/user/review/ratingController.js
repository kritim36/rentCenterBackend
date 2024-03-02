
const Rating = require("../../../model/Rating")
const ProductModel = require("../../../model/productModel")
const isAuthenticated = require("../../../middleware/isAuthenticated")
const express = require("express")
const router = express.Router()



const update_product_total_rating = async (id) => {

    let total_sum = 0

    const product = await Rating.findOne({productId : id})
    

    const total_users_rated = product.rated_users.length

    product.rated_users.forEach((user) => {
        total_sum += user.rated
    })

    const total_rating = total_sum / total_users_rated

    const updated_product_rating = await Rating.findOneAndUpdate(
        {productId : id},
        {
            $set : {
                total_rating : total_rating
            }
        },
        {new : true}
        )
        console.log(updated_product_rating)
        return updated_product_rating
}


function recommendProducts(user, ratingsData) {
    const userRatings = ratingsData.filter(rating => rating.userId === user);
    const otherUsers = Array.from(new Set(ratingsData.map(rating => rating.userId))).filter(userId => userId !== user);

    const recommendations = [];

    for (const otherUser of otherUsers) {
        for (const product of Array.from(new Set(ratingsData.filter(rating => rating.userId === otherUser).map(rating => rating.productId)))) {
            if (!userRatings.some(rating => rating.productId === product)) {
                const ratingsForProduct = ratingsData.filter(rating => rating.productId === product);
                const ratingSum = ratingsForProduct.reduce((total, rating) => total + rating.rating, 0);
                const avgRating = ratingSum / ratingsForProduct.length;
                recommendations.push({ product, avgRating });
            }
        }
    }

    recommendations.sort((a, b) => b.avgRating - a.avgRating);

    return recommendations
}

router.post("/create_rating/:id",isAuthenticated, async (req ,res) => {
// res.json({msg :req.params.id})
//console.log(req.body)
const user = req.user._id
const item_id = req.params.id
const {rate , category} = req.body
// res.json({item : item_id})

const find_rating = await Rating.find({productId : item_id})

if(find_rating.length == 0){
const create_new = await Rating.create({
    productId : item_id,
    rated_users : {
        userId : user,
        rated : rate
    },
    total_rating : rate,
    category : category
})

const {total_rating} = create_new

res.json({rating : Math.floor(total_rating)})

}else{


    const response = await Rating.findOne({
            productId : item_id , 
            'rated_users.userId' : user 
        
        })

        if(response == null){
            let new_rating = await Rating.findOneAndUpdate(
                {
                            productId : item_id
                        
                        },
                 {$push : {
                    rated_users : {
                        userId : user,
                        rated : rate
                    }
                 }
                }       
            ) 

          const {total_rating} =  await update_product_total_rating(item_id)
            res.json({rating : Math.floor(total_rating)})


        }
        else{
          const d =    await  Rating.findOneAndUpdate(
        {
            productId : item_id , 
            'rated_users.userId' : user 
        
        },
        {
        $set: {
            'rated_users.$.rated': rate
        }
    },
    {new : true})

    const {total_rating} =  await update_product_total_rating(item_id)
            res.json({rating : Math.floor(total_rating)})

        }

}



})

const create_product_rating_list = (product_lists) => {
const ratings = []

product_lists.forEach((product) => {
    product.rated_users.forEach((user) => {
        let obj = {}
        obj.userId = user.userId.toString()
        obj.productId = product.productId.toString()
        obj.rating = user.rated

        ratings.push(obj)
    })
})

//console.log("the new filtered lists is " , ratings)

return ratings
}

router.get("/get_rating/:id", async (req ,res) =>{
    const id  = req.params.id
    let product_category
   // console.log("the id is " , id )
    const product = await Rating.findOne({productId : id})

    if(product == null ){
        res.json({rating : 0})
    }
    else{
        product_category = product.category
        const product_according_to_category = await Rating.find({category : product_category})


      const product_rating_lists  =   create_product_rating_list(product_according_to_category)
      const recommended_rating = recommendProducts(id , product_rating_lists)

      //console.log("the recommended list is " , recommended_rating)

    
    let re = await Promise.all(recommended_rating.map(async (product) => {
        console.log("the id is" , product.product)
        return await ProductModel.findOne({ _id: product.product });
    }));
    
    //console.log(re);



        res.json({rating : Math.floor(product.total_rating) , similar_products : re })
    }

    
})



const get_all_product = async () => {

}

router.get("/rating" , async (req , res) =>{
    let rated_users_lists = []
    const rating_list = await Rating.find({category : "Mobile"})


    res.json(rating_list)
})


module.exports = router

