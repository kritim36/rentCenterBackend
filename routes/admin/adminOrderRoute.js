const { getAllOrders, updateOrderStatus, getSingleOrder, deleteOrder } = require("../../controller/admin/order/orderController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

router.route("/orders")
.get(isAuthenticated,restrictTo("admin"), catchAsync(getAllOrders))
router.route("/orders/:id")
.patch(isAuthenticated,restrictTo("admin"), catchAsync(updateOrderStatus))
.get(isAuthenticated,restrictTo("admin"), catchAsync(getSingleOrder))
.delete(isAuthenticated,restrictTo("admin"), catchAsync(deleteOrder))

module.exports = router