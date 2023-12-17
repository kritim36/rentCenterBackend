const User = require("../../../model/userModel")

exports.getUsers = async(req,res)=>{
    const userId = req.user.id
    const users = await User.find({_id : {$ne : userId}}).select(["+otp","+isOtpVerified","-__v"])
    if(users.length > 1){
        res.status(200).json({
            message : "User fetched sucessfully",
            data : users
        })
    }else{
        res.status(404).json({
            message : "User collection is empty",
            data : []
        })
    }
}

//delete users
exports.deleteUser = async(req,res)=>{
    const userId = req.params.id
    if(!userId){
        return res.status(404).json({
            message : "Please provide userId"
        })
    }
    //check if the userId user exist or not 
    const user = await User.findById(userId)
    if(!user){
        res.status(404).json({
            message : "User not found with that userId"
        })
    }else{
        await User.findByIdAndDelete(userId)
        res.status(200).json({
            message : "User deleted sucessfully"
        })
    }
}