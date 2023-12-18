const { getMyProfile, updateMyProfile, deleteMyProfile, updateMyPassword } = require("../../controller/user/profile/profileController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

router.route("/")
.get(isAuthenticated, catchAsync(getMyProfile))
.patch(isAuthenticated, catchAsync(updateMyProfile))
.delete(isAuthenticated, catchAsync(deleteMyProfile))

router.route("/changePassword")
.patch(isAuthenticated, catchAsync(updateMyPassword))

module.exports = router