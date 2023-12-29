const HostVehicle = require("../../model/hostVehicleModel");
const User = require("../../model/userModel");

exports.hostVehicle = async(req,res)=>{
    const userId = req.user.id
    const{ownerName, registrationNumber, model, manufacturer} = req.body
    if(!ownerName || !registrationNumber || !model || !manufacturer){
        return res.status(400).json({
            message : "Please provide ownerName, registrationNumber, model, manufacturer"
        })
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({
         message: 'User not found' 
        })
    }

    const newVehicle = await HostVehicle.create({
        ownerName,
        registrationNumber,
        model,
        manufacturer,
        hostedBy : userId,
        approved : false
      })

    res.status(200).json({
        message : "Vehicle hosted sucessfully",
        data : newVehicle
    })

}