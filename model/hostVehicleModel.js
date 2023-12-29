const mongoose = require("mongoose")
const Schema = mongoose.Schema

const hostVehicleSchema = new Schema({
    ownerName : {
        type : String,
        required : true
    },
    registrationNumber : {
        type : Number,
        required : true
    },
    model : {
        type : String,
        required : true
    },
    manufacturer : {
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
    }

})

const HostVehicle = mongoose.model("HostVehicle", hostVehicleSchema)
module.exports = HostVehicle