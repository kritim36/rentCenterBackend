const mongoose = require("mongoose")
const Schema = mongoose.Schema

const renterSchema = new Schema({
    productName : {
        type : String,
        required : true
    },
    productBrand : {
        type : String,
        enum : ["Apple","Xiaomi","Vivo","Samsung","Dell","HP","Lenovo","Asus","L.G.","Sony","Canon","Nikon","Mercedes","Honda","Hero","BMW","BYD","Ford","Yamaha","Hyundai","Suzuki","Tata","Tyota"],
        required : true
    },
    productCategory : {
        type : String,
        enum : ["Mobile","Laptop","Camera","Tv","Cars","Bike"]
    },
    productLocation : {
        type : String,
        required : true
    },
    productPrice : {
        type : Number,
        required : true
    },
    productRegistrationNumber : {
        type : Number,
        
    },
    productModelNumber : {
        type : Number
    },
    productFuelType : {
        type : String,
        enum : ["petrol","disel","electric","hybrid"]
    },
    availableDate: {
        type : Date ,
        Required : true  
    },
    productGuideline : {
        type : String,
        required : true
    },
    productImage : {
        type : String,
        required : true
    },
    productInsuranceImage : {
        type : String
    },
    productBluebookImage : {
        type : String
    },
    productDescription : {
        type : String,
        required : true
    },
    hostedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    approved : {
        type : Boolean,
        default : false        
    },

})

const Host = mongoose.model("Host", renterSchema)
module.exports = Host


