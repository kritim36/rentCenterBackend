const express = require("express")
const { connectDatabase } = require("./database/database")
const app = express()

const {Server} = require("socket.io")
const cors = require("cors")


app.set('view engine','ejs')

//routes
const authRoute = require("./routes/auth/authRoute")
const productRoute = require("./routes/admin/productRoute")
const adminUserRoute = require("./routes/admin/adminUsersRoute")
const adminOrderRoute = require("./routes/admin/adminOrderRoute")
const dataServiceRoute = require("./routes/admin/dataServiceRoute")
const userReviewRoute = require("./routes/user/userReviewRoute")
const profileRoute = require("./routes/user/profileRoute")
const cartRoute = require("./routes/user/cartRoute")
const orderRoute = require("./routes/user/orderRoute")
const paymentRoute = require("./routes/user/paymentRoute")
const renterRoute = require("./routes/user/renterRoute")
const adminHostRoute = require("./routes/admin/adminHostRoute")
const rating = require("./controller/user/review/ratingController")

app.use(cors({
    origin : '*'
}))

// Routes end here 

// app.use(cors({
//     origin: '*'
// }))
require('dotenv').config()
//database connection
connectDatabase(process.env.MONGO_URI)

app.use(express.json())
app.use(express.urlencoded ({extended : true}))

// app.get('/chat',(req,res)=>{
//     res.render("home.ejs")
// })

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
app.use("/api/admin",dataServiceRoute)
app.use("/api/reviews", userReviewRoute)
app.use("/api/profile", profileRoute)
app.use("/api/cart", cartRoute)
app.use("/api/orders", orderRoute)
app.use("/api/payment",paymentRoute)
app.use("/api/renter",renterRoute)
app.use("/api/admin/renter",adminHostRoute)
app.use("/api", rating)


const PORT = process.env.PORT
//listen
const server = app.listen(3000,()=>{
    console.log(`Server has started at ${PORT}`)
})
const io = new Server(server)

/*io.on("connection",(socket)=>{
    console.log("A user connected")
})*/

function getSocketIo(){
    return io 
}

module.exports.getSocketIo = getSocketIo