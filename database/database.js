const mongoose = require("mongoose")
const adminSeeder = require("../adminSeeder")

exports.connectDatabase = async (URI)=>{
 await   mongoose.connect(URI)
    console.log("Database connected Sucessfully")

    //admin seeding
    adminSeeder()
}