const { registerUser, loginUser, forgetPassword, verifyOtp, resetPassword } = require("../../controller/auth/authController")
const catchAsync = require("../../services/catchAsync")
const User = require("../../model/userModel")
const sendEmail =  require("../../services/sendEmail")
const router = require("express").Router()

//routes
router.route("/register").post(catchAsync(registerUser))
router.route("/login").post(catchAsync(loginUser))
router.post("/forgetPassword",async (req,res)=>{
    const {email} = req.body
    if(!email){
        res.status(400).json({
            message : "Please provide email"
        })
    }
    const userExist = await User.findOne({userEmail : email})
    if(userExist.length == 0){
         res.status(400).json({
            message : "User with that email is not registered"
        })
    }

    //send otp to that email
    const Otp = Math.floor(1000 + Math.random() * 9000);
    // userExist.otp = otp 
    // await userExist.save()
   await sendEmail({
        email :email,
        subject : "Your Otp for rentCenter forgotPassword",
        message : `Your otp is ${Otp} . Dont share with anyone`
    })
    await User.updateOne({userEmail: email},
        {
            $set:{
                otp:Otp
            }
        })
    res.status(200).json({
        message : "OTP sent successfully",
        data : email
    })
  
})
router.route("/verifyOtp").post(catchAsync(verifyOtp))
router.route("/resetPassword").post(catchAsync(resetPassword))

module.exports = router