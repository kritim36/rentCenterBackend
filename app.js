const express = require("express")
const { connectDatabase } = require("./database/database")
const app = express()

//routes
const authRoute = require("./routes/auth/authRoute")
const productRoute = require("./routes/productRoute")
const adminUserRoute = require("./routes/adminUsersRoute")
const userReview = require("./routes/userReviewRoute")

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

app.use("/api", authRoute)
app.use("/api",productRoute)
app.use("/api", adminUserRoute)
app.use("./api", userReview)



const PORT = process.env.PORT
//listen
app.listen(3000,()=>{
    console.log(`Server has started at ${PORT}`)
})