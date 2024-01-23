const Renter = require("../../model/renterModel");
const User = require("../../model/userModel");

exports.hostitem = async(req,res)=>{
    const userId = req.user.id
    const file = req.file
   
    let filePath
    if(!file){
        filePath = "https://hips.hearstapps.com/hmg-prod/images/dw-burnett-pcoty22-8260-1671143390.jpg?crop=0.668xw:1.00xh;0.184xw,0&resize=640:*"
    }else{
        filePath = req.file.filename
    }
    
    const{itemName,itemBrand,itemCategory,itemLocation,itemPrice,itemRegistrationNumber, itemAvailable,itemInstructions} = req.body
    if(!itemName || !itemBrand || !itemCategory || !itemLocation || !itemPrice || !itemRegistrationNumber || !itemAvailable || !itemInstructions){
        return res.status(400).json({
            message : "Please provide itemName,itemBrand,itemCategory,itemLocation,itemPrice,itemRegistrationNumber, itemAvailable, itemImage,itemInsuranceImage,itemBluebookImage,itemInstructions"
        })
    }


    // const userExists = await User.findById(userId);
    // if (!userExists) {
    //   return res.status(400).json({
    //      message: 'User not found' 
    //     })
    // }

    const newHost = await Renter.create({
        itemName,
        itemBrand,
        itemCategory,
        itemLocation,
        itemPrice,
        itemRegistrationNumber,
        itemAvailable, 
        itemImage : process.env.BACKEND_URL + filePath,
        itemInsuranceImage : process.env.BACKEND_URL + filePath,
        itemBluebookImage : process.env.BACKEND_URL + filePath,
        itemInstructions,
        hostedBy : userId
      })
      
      

    res.status(200).json({
        message : "Vehicle hosted sucessfully",
        data : newHost
    })

}