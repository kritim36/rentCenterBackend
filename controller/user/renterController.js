const Renter = require("../../model/renterModel");
const fs = require("fs")

exports.hostitem = async(req,res)=>{
    const userId = req.user.id
    const file = req.file
   
    let filePath
    if(!file){
        filePath = "https://hips.hearstapps.com/hmg-prod/images/dw-burnett-pcoty22-8260-1671143390.jpg?crop=0.668xw:1.00xh;0.184xw,0&resize=640:*"
    }else{
        filePath = req.file.filename
    }
    
    const{itemName,itemBrand,itemCategory,itemLocation,itemPrice,itemRegistrationNumber, itemAvailable,itemInstructions, itemGuideline,itemFuelType,itemModelNumber} = req.body
    if(!itemName || !itemBrand || !itemCategory || !itemLocation || !itemPrice || !itemRegistrationNumber || !itemAvailable || !itemInstructions  || !itemGuideline || !itemFuelType || !itemModelNumber){
        return res.status(400).json({
            message : "Please provide itemName,itemBrand,itemCategory,itemLocation,itemPrice,itemRegistrationNumber, itemAvailable, itemImage,itemInsuranceImage,itemBluebookImage,itemInstructions,itemFuelType,itemModelNumber,itemInsurancedate,itemGuideline"
        })
    }

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
        // itemInsurancedate,
        itemGuideline,
        itemFuelType,
        itemModelNumber,
        hostedBy : userId,
        
      })
      

    res.status(200).json({
        message : "Vehicle hosted sucessfully",
        data : newHost
    })

}

exports.getItems = async(req,res)=>{
 
    const items = await Renter.find()
    if(items.length == 0 ){
        res.status(400).json({
            message : "No product Found",
           data : []
        })
    }else{
        res.status(200).json({
            message : "Products Fetched Successfully",
            data : items 
        })
    }
   
}

exports.updateItemAvailable = async(req,res)=>{
    const userId = req.user.id
    const {id} = req.params 
    const {itemAvailable} = req.body 
    

    const renter = await Renter.findById(id)
    if(!renter){
        return res.status(404).json({
            message : "No item found with that id"
        })
    }
    
    const approveRenter = await Renter.findById(id,{approved : true})
    if(!approveRenter){
        return res.status(400).json({
            message : "No approveRenter"
        })
    }

    if(renter.hostedBy != userId){
        return res.status(400).json({
            message : "You don't have permission to delete this item"
        })
    }
    if(!itemAvailable){
        return res.status(404).json({
            message : "provide itemAvailable"
        })
    }
   

    // if(!itemAvailable || !['available','unavailable'].includes(itemAvailable.toLowerCase())){
    //     return res.status(400).json({
    //         message : "itemStatus is invalid or should be provided"
    //     })
    // }
  
    const updatedItem = await Renter.findByIdAndUpdate(id,{
          itemAvailable
    },{new:true})

    res.status(200).json({
        message : "product status updated Successfully",
        data : updatedItem
    })
}

exports.deleteItem = async(req,res)=>{
    const{id} = req.params
    const userId = req.user.id
    const renter = await Renter.findById(id)
    if(!renter){
        return res.status(404).json({
            message : "No item found with that id"
        })
    }
    const approveRenter = await Renter.findById(id,{approved : true})
    if(!approveRenter){
        return res.status(400).json({
            message : "No approveRenter"
        })
    }

    if(renter.hostedBy != userId){
        return res.status(400).json({
            message : "You don't have permission to delete this item"
        })
    }

    const oldData = await Renter.findById(id)
    if(!oldData){
        return res.status(404).json({
            message : "No data found with that id"
        })
    }
 
    const oldItemImage = [oldData.itemImage, oldData.itemInsuranceImage, oldData.itemBluebookImage]
   
    const lengthToCut  = process.env.BACKEND_URL.length
    const finalFilePathAfterCut = [oldItemImage.slice(lengthToCut)] 
         // REMOVE FILE FROM UPLOADS FOLDER
            fs.unlink("./uploads/" +  finalFilePathAfterCut,(err)=>{
                if(err){
                    console.log("error deleting file",err) 
                }else{
                    console.log("file deleted successfully")
                }
            })

    await Renter.findByIdAndDelete(id)
    res.status(200).json({
        message : "Product deleted sucessfully",
        data : null
    })
}


// exports.getOrdersOfAItem = async(req,res)=>{
//     const {id:productId} = req.params

//     // check if this productExist or not 
//     const product = await Product.findById(productId)
//     if(!product ){
//        return res.status(400).json({
//             message : "No product Found"
//         })
//     }
//     const orders = await Order.find({'items.product' : productId})
//     console.log(orders)

//     res.status(200).json({
//         message : "Product ORdres fetched",
//         data : orders
//     })
// }

