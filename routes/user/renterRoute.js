const { hostitem } = require("../../controller/user/renterController")
const {multer,storage} = require("../../middleware/multerConfig")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()
const upload = multer({storage : storage})

router.route('/host')
.post(isAuthenticated,
    upload.fields([{
        name : 'itemImage', maxCount: 1
    },{
        name: 'itemInsuranceImage', maxCount : 1
    },{
        name: 'itemBluebookImage', maxCount: 1
    }]),
      catchAsync(hostitem))

module.exports = router

// upload.single('itemImage'), upload.single('itemInsuranceImage'), upload.single('itemBluebookImage')
