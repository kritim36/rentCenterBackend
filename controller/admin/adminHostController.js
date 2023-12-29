const HostVehicle = require('../../model/hostVehicleModel');


exports.getPendingApproval = async(req,res)=>{
    const pendingApprovals = await HostVehicle.find({approved : false})
    res.status(200).json({
        message : "pending approval"
    })

}

exports.approveVehicle = async (req,res)=>{
    const {vehicleId} = req.params;
    const vehicle = await HostVehicle.findById(vehicleId)
    if(!vehicle){
        return res.status(400).json({
            message : "Vehicle not found"
        })
    }
    //Approve the vehicle
    vehicle.approved = true
    await vehicle.save()

    res.status(200).json({
        message : "Vehicle approved sucessfully",
        data : vehicle
    })
}





