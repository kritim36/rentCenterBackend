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

router.route('/pendingApproval/approve/:id')
.patch(isAuthenticated, restrictTo("admin"), catchAsync(approveVehicle))



module.exports = router