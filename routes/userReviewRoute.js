const { createReview, deleteReview, getReview } = require("../controller/user/review/userController")
const isAuthenticated = require("../middleware/isAuthenticated")
const restrictTo = require("../middleware/restrictTo")
const catchAsync = require("../services/catchAsync")

const router = require("express").Router()

router.route('/reviews/:id')
.post(isAuthenticated, restrictTo("user"), catchAsync(createReview))
.delete(isAuthenticated, catchAsync(deleteReview))

router.route('/reviews')
.get(getReview)


module.exports = router