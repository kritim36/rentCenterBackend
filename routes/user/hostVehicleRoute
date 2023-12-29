const { hostVehicle } = require("../../controller/user/hostVehicleController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

router.route('/hostVehicle')
.post(isAuthenticated, catchAsync(hostVehicle))