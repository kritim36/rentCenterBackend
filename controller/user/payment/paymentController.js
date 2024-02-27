const { default: axios } = require("axios")
const Order = require("../../../model/orderSchema")
const User = require("../../../model/userModel")


exports.initiateKhaltiPayment = async(req,res)=>{
    const {orderId,amount}  = req.body 
    if(!orderId || !amount){
        return res.status(400).json({
            message : "Please provide orderId,amount"
        })
    }
let order = await Order.findById(orderId)
if(!order){
    return res.status(404).json({
        message : "Order not Found with that id"
    })
}

if(order.totalAmount !== amount){
    return res.status(400).json({
        message : "Amount must be equal to totalAmount"
    })
}
    const data = {
        return_url : "http://localhost:5173/success",
        purchase_order_id : orderId,
        amount : amount,
        website_url : "http://localhost:3000/",
        purchase_order_name : "orderName_" + orderId
    }
const response =     await axios.post("https://a.khalti.com/api/v2/epayment/initiate/",data,{
        headers : {
            'Authorization' : 'key b0bf1b88c08641649e5df9805f7b009d'
        }
    })

 order.paymentDetails.pidx = response.data.pidx 

 await order.save()
 res.status(200).json({
    message : "Payment successful",
    paymentUrl : response.data.payment_url
   })

}

exports.verifyPidx = async(req,res)=>{
   const userId = req.user.id
    const pidx = req.body.pidx
   const response =  await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",{pidx },{
    headers : {
        'Authorization' : 'key b0bf1b88c08641649e5df9805f7b009d'

    }
   })
   
   if(response.data.status == 'Completed'){
    // modification in datbase
   let order = await Order.find({'paymentDetails.pidx' : pidx})
   
   order[0].paymentDetails.method = 'Khalti'
   order[0].paymentDetails.status = "paid"
   await order[0].save()
    // empty user cart
    const user = await User.findById(userId) 
    user.cart = []
    await user.save()
    res.status(200).json({
        message : "Payment Verified Successfully"
    })

}
}



/*exports.verifyPidx = async(req,res)=>{
    const app = require('./../../../app')
    const io = app.getSocketIo
    const pidx = req.query.pidx
    const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",{pidx},{
        headers : {
            'Authorization' : 'key b0bf1b88c08641649e5df9805f7b009d'
        }
    })

    if(response.data.status == 'Completed'){
        //modification in database
        let order = await Order.find({'paymentDetails.pidx' : pidx})
        console.log(order)
        order[0].paymentDetails.method = 'khalti'
        order[0].paymentDetails.status = 'paid'
        await order[0].save()

        //get the socket.id of requesting user
        io.on("connection",(socket)=>{
            io.to(socket.id).emit("payment",{message : "Payment Successfully"})
        })
        
        //notify to frontend
        io.emit("payment",{message : "Payment Sucessfully"})
        //res.redirect("http://localhost:3000")
    
    }else{
        //notify error to frontend
        io.on("connection",(socket)=>{
            io.to(socket.id).emit("payment",{message : "Payment Failure"})
        })
        //notify error to frontend
        res.redirect("http://localhost:3000/errorPage")
    }
    
}*/