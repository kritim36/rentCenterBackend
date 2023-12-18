const User = require("../../../model/userModel")
const bcrypt = require("bcryptjs")

//get myProfile
exports.getMyProfile = async(req,res)=>{
    const userId = req.user.id
    const myProfile = await User.findById(userId)

    res.status(200).json({
        message : "Profile fetched sucessfully",
        data : myProfile
    })
}

//update profile
exports.updateMyProfile = async(req,res)=>{
    const{userEmail, userName, userPhoneNumber} = req.body
    const userId = req.user.id

    const updateData =  await User.findByIdAndUpdate(userId,{userName, userEmail, userPhoneNumber},{
        runValidators : true,
        new : true
    })
    res.status(200).json({
        message : "Profile updated sucessfully",
        data : updateData
    })
}

//delete profile
exports.deleteMyProfile = async(req,res)=>{
    const userId = req.user.id
    await User.findByIdAndDelete(userId)
    res.status(200).json({
        message : "Profile deleted sucessfully",
        data : null
    })
}

//update myProfile password
exports.updateMyPassword = async(rea,res)=>{
    const userId = req.user.id
    const{oldPassword, newPassword, confirmPassword} = req.body
    if(!oldPassword || !newPassword || !confirmPassword){
        return res.status(400).json({
            message : "Please provide oldPassword, newPassword, confirmPassword"
        })
    }

    if(newPassword !== confirmPassword){
        return res.status(400).json({
            message : "NewPassword and confirmPassword doesnot match"
        })
    }
     // taking out the hash of the old password 
     const userData = await User.findById(userId)
     const hashedOldPassword  = userData.userPassword 
 
 
     // check if oldPassword is correct or not
     const isOldPasswordCorrect =  bcrypt.compareSync(oldPassword,hashedOldPassword)
     if(!isOldPasswordCorrect){
         return res.status(400).json({
             message : "OldPassword didn't matched"
         })
     }
     //if  matched
     userData.userPassword= bcrypt.hashSync(newPassword,12)
     await userData.save()
     res.status(200).json({
         message  : "Password Changed successfully",
         
     })
}