
const Rating = require("../../../model/Rating")
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




router.post("/create_rating/:id",isAuthenticated, async (req ,res) => {
// res.json({msg :req.params.id})
console.log(req.body)
const user = req.user._id
const item_id = req.params.id
const {rate} = req.body
// res.json({item : item_id})

const find_rating = await Rating.find({productId : item_id})

if(find_rating.length == 0){
const create_new = await Rating.create({
    productId : item_id,
    rated_users : {
        userId : user,
        rated : rate
    },
    total_rating : rate
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

router.get("/get_rating/:id", async (req ,res) =>{
    const id  = req.params.id
    console.log("the id is " , id )
    const product = await Rating.findOne({productId : id})
    if(product == null ){
        res.json({rating : 0})
    }
    else{
        res.json({rating : Math.floor(product.total_rating) })
    }

    
})



// const get_rating = async () => {
//     const rating = await Rating.find()
//     return rating
// }

module.exports = router
