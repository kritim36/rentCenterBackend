const mongoose = require("mongoose")
const Schema = mongoose.Schema


const rating_schema = new Schema(
       {
          productId : {
                     type : Schema.Types.ObjectId,
                     ref : "Product",
                     required : [true,"A review must be of product"],
 
                  },
          rated_users : [{
             userId : {
                type : Schema.Types.ObjectId,
                ref : "User",
                required : [true,"A review must belong to user"] 
            },
            rated : {type : Number}
          }],
          total_rating : {type : Number}
       }
 )



const Rating = mongoose.model("Rating", rating_schema)
module.exports = Rating