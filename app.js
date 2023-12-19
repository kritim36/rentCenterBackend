const express = require("express")
const { connectDatabase } = require("./database/database")
const app = express()

//routes
const authRoute = require("./routes/auth/authRoute")
const productRoute = require("./routes/admin/productRoute")
const adminUserRoute = require("./routes/admin/adminUsersRoute")
const adminOrderRoute = require("./routes/admin/adminOrderRoute")
const userReview = require("./routes/user/userReviewRoute")
const profileRoute = require("./routes/user/profileRoute")
const cartRoute = require("./routes/user/cartRoute")
const orderRoute = require("./routes/user/orderRoute")

require('dotenv').config()
//database connection
connectDatabase(process.env.MONGO_URI)

app.use(express.json())
app.use(express.urlencoded ({extended : true}))

// telling nodejs to give access to uploads folder 
app.use(express.static("./uploads"))

//test api
app.get("/",(req,res)=>{
    res.status(200).json({
        message : "I am alive"
    })
})

app.use("/api/auth", authRoute)
app.use("/api/product",productRoute)
app.use("/api/admin", adminUserRoute)
app.use("/api/admin", adminOrderRoute)
app.use("/api/reviews", userReview)
app.use("/api/profile", profileRoute)
app.use("/api/cart", cartRoute)
app.use("/api/orders", orderRoute)



const PORT = process.env.PORT
//listen
app.listen(3000,()=>{
    console.log(`Server has started at ${PORT}`)
})