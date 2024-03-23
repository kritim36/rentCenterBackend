const Host = require("../../model/hostModel");
const fs = require("fs")

exports.hostitem = async(req,res)=>{
    const userId = req.user.id
    const file = req.file
   console.log("hyy",req.file)
   
    let filePath
    if(!file){
        filePath = "https://hips.hearstapps.com/hmg-prod/images/dw-burnett-pcoty22-8260-1671143390.jpg?crop=0.668xw:1.00xh;0.184xw,0&resize=640:*"
    }else{
        filePath = req.file.filename
        console.log("file",filePath)
        console.log("k", req.file.filePath)
    }

    
    const{productName,productBrand,productCategory,productLocation,productPrice,availableDate,productDescription, productGuideline,productRegistrationNumber,productFuelType,productModelNumber} = req.body
    if(!productName || !productBrand || !productCategory || !productLocation || !productPrice || !availableDate || !productDescription  || !productGuideline ){
        return res.status(400).json({
            message : "Please provide itemName,itemBrand,itemCategory,itemLocation,itemPrice, itemAvailable,itemInstructions,itemGuideline"
        })
    }
    console.log("hello" , req.body)
    

    const newHost = await Host.create({
        productName,
        productBrand,
        productCategory,
        productLocation,
        productPrice,
        productRegistrationNumber : 20103100,
        availableDate, 
        productImage : process.env.BACKEND_URL + filePath,
        productInsuranceImage : process.env.BACKEND_URL + filePath,
        productBluebookImage : process.env.BACKEND_URL + filePath,
        productDescription,
        productGuideline,
        productFuelType,
        productModelNumber,
        hostedBy : userId,
        
      })
      

    res.status(200).json({
        message : "Vehicle hosted sucessfully",
        data : newHost
    })

}

exports.getItems = async(req,res)=>{
 
    const items = await Host.find()
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
    

    const renter = await Host.findById(id)
    if(!renter){
        return res.status(404).json({
            message : "No item found with that id"
        })
    }
    
    const approveRenter = await Host.findById(id,{approved : true})
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
  
    const updatedItem = await Host.findByIdAndUpdate(id,{
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
    const approveRenter = await Host.findById(id,{approved : true})
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

    const oldData = await Host.findById(id)
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

    await Host.findByIdAndDelete(id)
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

