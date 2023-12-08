const express = require("express")
const { connectDatabase } = require("./database/database")
const app = express()

//routes
const authRoute = require("./routes/auth/authRoute")

require('dotenv').config()
//database connection
connectDatabase(process.env.MONGO_URI)

app.use(express.json())
app.use(express.urlencoded ({extended : true}))


//test api
app.get("/",(req,res)=>{
    res.status(200).json({
        message : "I am alive"
    })
})

app.use("", authRoute)



const PORT = process.env.PORT
//listen
app.listen(3000,()=>{
    console.log(`Server has started at ${PORT}`)
})