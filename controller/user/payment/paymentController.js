const { default: axios } = require("axios")

exports.initiateKhaltiPayment = async(req,res)=>{
    const{orderId, amount} = req.body
    if(!orderId || !amount){
        return res.status(400).json({
            message : "Please provide orderId,amount"
        })
    }
    const data = {
        return_url : "http://localhost:3000/api/payment/success",
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
    //console.log(response.data)

    res.redirect(response.data.payment_url)
}