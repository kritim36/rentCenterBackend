
const { createReview, deleteReview, getMyReviews } = require("../../controller/user/review/reviewController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

router.route('/:id')
.post(isAuthenticated, restrictTo("user"), catchAsync(createReview))
.delete(isAuthenticated, catchAsync(deleteReview))

router.route('/')
.get(isAuthenticated, catchAsync(getMyReviews))


module.exports = router