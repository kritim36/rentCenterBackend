const { registerUser, loginUser, forgetPassword, verifyOtp, resetPassword } = require("../../controller/auth/authController")


const router = require("express").Router()

//routes
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/forgetPassword").post(forgetPassword)
router.route("/verifyOtp").post(verifyOtp)
router.route("/resetPassword").post(resetPassword)

module.exports = router