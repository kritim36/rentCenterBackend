const Host = require("../../model/hostModel")




exports.getPendingApproval = async(req,res)=>{
    const pendingApprovals = await Host.find({approved : false})
    res.status(200).json({
        message : "pending approval",
        data : pendingApprovals
    })

}

// exports.approveVehicle = async (req,res)=>{
//     const{id} = req.params
//     if(!id){
//         return res.status(404).json({
//             message : "Please provide id"
//         })
//     }
    
//     const host = await Renter.findByIdAndUpdate(id)
//     if(!host){
//         return res.status(400).json({
//             message : "not hosted product"
//         })
//     }
//     //Approve the vehicle
//     host.approved = true
//     await host.save()

//     res.status(200).json({
//         message : "host approved sucessfully",
//         data : host
//     })
// }

exports.approveVehicle = async(req,res)=>{
    const{id} = req.params
    const{approved} = req.body
    if(!id){
        return res.status(404).json({
            message : "Plesae Provide id"
        })
    }

    const host = await Host.findById(id)
    if(!host){
        return res.status(404).json({
            message : "No host product found"
        })
    }

    const approvedVehicle = await Host.findByIdAndUpdate(id,{
        approved
    },{new:true})

    // Approve the vehicle
    approvedVehicle.approved = true
    await approvedVehicle.save()

    res.status(200).json({
        message : "Product approved Sucessfully",
        data : approvedVehicle
    })
}





