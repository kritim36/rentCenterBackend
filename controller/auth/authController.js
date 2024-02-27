const User = require("../../model/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../../services/sendEmail")

exports.registerUser = async (req,res)=>{
    const{email,userName,phoneNumber,password} = req.body
    if(!email || !userName || !phoneNumber || !password){
       return res.status(400).json({
            message : "Please provide email, userName, phoneNumber, password"
        })
    }
    const userFound = await User.find({userEmail : email})
    if(userFound.length > 0 ){
      return  res.status(400).json({
            message : "User with that email already registered",
            data : []
        })
    }


    const userData = await User.create({
        userEmail : email,
        userName : userName,
        userPhoneNumber : phoneNumber,
        userPassword : bcrypt.hashSync(password, 10)
    })

    res.status(201).json({
        message : "User registered sucessfully",
        data : userData
    })
}

exports.loginUser = async(req,res)=>{
    const{email,password} = req.body
    if(!email || !password){
      return  res.status(400).json({
            message : "Please provide email, password"
        })
    }

    //check if that emailUser exist or not 
    const userFound = await User.find({userEmail : email})
    if(userFound.length == 0){
      return  res.status(404).json({
            message : "User with that email is not registered"
        })
    }
    const isMatched = bcrypt.compare(password, userFound[0].userPassword)
    console.log(isMatched)
    if(isMatched){
        //generate token
        const token = jwt.sign({id : userFound[0]._id},process.env.SECRET_KEY,{
            expiresIn : '30d'
           })
           res.status(200).json({
            message : "Login sucessfully",
            data : userFound,
            token : token
           })
    }else{
        res.status(404).json({
            message : "Invalid Password"
        })
    }
}

// exports.forgetPassword = async(req,res)=>{
//     const{email} = req.body
//     if(!email){
//         res.status(400).json({
//             message : "Please provide email"
//         })
//     }
//     const userExist = await User.find({userEmail : email})
//     if(userExist.length == 0){
//          res.status(400).json({
//             message : "User with that email is not registered"
//         })
//     }

//     //send otp to that email
//     const otp = Math.floor(1000 + Math.random() * 9000);
//     userExist[0].otp = otp 
//     await userExist[0].save()
//    await sendEmail({
//         email :email,
//         subject : "Your Otp for rentCenter forgotPassword",
//         message : `Your otp is ${otp} . Dont share with anyone`
//     })
//     res.status(200).json({
//         message : "OTP sent successfully",
//         data : email
//     })
  
// }

exports.verifyOtp = async (req,res)=>{
    const{email,otp} = req.body
    if(!email || !otp){
        return res.status(400).json({
            message : "Please provide email,otp"
        })
    }

    const userExist = await User.find({userEmail : email})
    if(userExist.length == 0){
        return res.status(400).json({
            message : "Email is not registered"
        })
    }
    console.log(userExist[0].otp)
    if(userExist[0].otp != otp){
         res.status(400).json({
            message : "Invalid otp"
        })
    }else{
        //dispost the otp so cannot be used for the next time the same otp
        // userExist[0].otp = undefined
        userExist[0].isOtpVerified = true
        // await userExist[0].save()
        await User.updateOne({userEmail: email},
            {
                $set:{
                    isOtpVerified:true
                }
            })
        res.status(200).json({
            message : "Otp is correct"
        })
    }
}

exports.resetPassword = async (req,res)=>{
    const{email,newPassword,confirmPassword} = req.body
    if(!email || !newPassword || !confirmPassword){
        return res.status(400).json({
            message : "Please provide email,newPassword,confirmPassword"
        })
    }
    if(newPassword != confirmPassword){
       return res.status(400).json({
            message : "newPassword and confirmPassword doesnot match"
        })
    }

    const userExist = await User.find({userEmail : email})
    if(userExist.length == 0){
        return res.status(400).json({
            message : "Email is not registered"
        })
    }

    if(userExist[0].isOtpVerified != true){
        return res.status(403).json({
            message : "You cannot perform this action"
        })
    }

    // userExist[0].userPassword= bcrypt.hashSync(newPassword,10)
    // userExist[0].isOtpVerified = false;
    // await userExist[0].save()

    res.status(200).json({
        message : "Password changed successfully"
    })
}