const mongoose = require("mongoose")
const Schema = mongoose.Schema

const renterSchema = new Schema({
    itemName : {
        type : String,
        required : true
    },
    itemBrand : {
        type : String,
        enum : ["Vivo","Samsung","Dell","HP","Canon","Nikon","Mercedes","Toyota","Honda","Hero"],
        required : true
    },
    itemCategory : {
        type : String,
        enum : ["Mobile","Laptop","Camera","Cars","Bike"],
        required : true
    },
    itemLocation : {
        type : String,
        required : true
    },
    itemPrice : {
        type : Number,
        required : true
    },
    itemRegistrationNumber : {
        type : Number,
        required : true,
        unique : true
    },
    itemModelNumber : {
        type : Number,
        required : true
    },
    itemFuelType : {
        type : String,
        enum : ["petrol","disel","electric","hybrid"],
        required : true
    },
    itemAvailable : {
        type : String,
        enum : ["available", "unavailable"],
        required : true
    },
    itemGuideline : {
        type : String,
        required : true
    },
    // itemInsurancedate :{
    //     type : Date,
    //     required :true
    // },
    itemImage : {
        type : String,
        required : true
    },
    itemInsuranceImage : {
        type : String,
        required : true
    },
    itemBluebookImage : {
        type : String,
        required : true
    },
    itemInstructions : {
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

const Renter = mongoose.model("Renter", renterSchema)
module.exports = Renter


