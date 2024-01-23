const Host = require("../../model/renterModel");



exports.getPendingApproval = async(req,res)=>{
    const pendingApprovals = await Host.find({approved : false})
    res.status(200).json({
        message : "pending approval",
        data : pendingApprovals
    })

}

exports.approveVehicle = async (req,res)=>{
    const {hostId} = req.params;
    const host = await Host.findById(hostId)
    if(!host){
        return res.status(400).json({
            message : "not hosted"
        })
    }
    //Approve the vehicle
    host.approved = true
    await host.save()

    res.status(200).json({
        message : "host approved sucessfully",
        data : host
    })
}





