const { getPendingApproval, approveVehicle } = require("../../controller/admin/adminHostController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")
const catchAsync = require("../../services/catchAsync")
const {getApprovedrenter} = require('../../controller/admin/product/productController')
const Renter = require('../../model/renterModel')
const Product = require('../../model/productModel')
const router = require("express").Router()

router.route('/pendingApproval')
.get(isAuthenticated, restrictTo("admin"), catchAsync(getPendingApproval))

router.route('/approve/:id')
.patch(isAuthenticated, restrictTo("admin"), catchAsync(approveVehicle))

// router.route('/setProducts')
// .get(isAuthenticated, restrictTo("admin"), async(req,res)=>{
//     const id= req.user._id;
//     const approveRenter = await Renter.find({approved : true})
//     if(!approveRenter){
//         return res.status(400).json({
//             message : "No approveRenter"
//         })
//     }
// const setdata= await Product.create({
//     productOwner: id,
//     productBrand: approveRenter. itemBrand,
//     productCategory: approveRenter.itemCategory,
//     productName: approveRenter.itemName,
//     productDescription: approveRenter.itemInstructions,
//     productStockQty:1,
//     productPrice: approveRenter.itemPrice,
//     productStatus : approveRenter.itemAvailable
// })

//     res.status(200).json({
//         message : "Renter product fetched",
//         data: setdata
//     })
// })

module.exports = router