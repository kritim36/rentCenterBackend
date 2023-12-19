const { createOrder, getMyOrders } = require("../../controller/user/order/orderController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

router.route('/')
.post(isAuthenticated, catchAsync(createOrder))
.get(isAuthenticated, catchAsync(getMyOrders))

module.exports = router