const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productSchema = new Schema({
    productOwner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Renter"
    },
    productBrand : {
        type : String,
        enum : ["Vivo","Samsung","Dell","HP","Canon","Nikon","Mercedes","Toyota","Honda","Hero"],
        required : true

    },
    productCategory : {
        type : String,
        enum : ["Mobile","Laptop","Camera","Cars","Bike"],
        required : true
    },
    productName : {
        type : String,
        required : [true, "productName must be provided"]
    },
    productDescription : {
        type : String,
        required : [true,"productDescription must be provided"]
    },
    productStockQty : {
        type : Number,
        required : [true,"productQty must be provided"]
    },
    productPrice : {
        type : Number,
        required : [true,"productPrice must be provided"]
    },
    productStatus : {
        type : String,
        enum : ["available","unavailable"]
    },
    productImage : String
},{
    timestamps : true
})

const Product = mongoose.model("Product",productSchema)
module.exports = Product