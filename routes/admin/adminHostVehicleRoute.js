const { getPendingApproval, approveVehicle } = require("../../controller/admin/adminHostController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

router.route('/pendingApproval')
.get(isAuthenticated, restrictTo("admin"), catchAsync(getPendingApproval))

router.route('/approve/:id')
patch(isAuthenticated, restrictTo("admin"), catchAsync(approveVehicle))