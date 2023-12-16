const restrictTo = require("../middleware/restrictTo")
const {multer,storage} = require("../middleware/multerConfig")
const isAuthenticated = require("../middleware/isAuthenticated")
const { createProduct, getProducts, getProduct, deleteProduct, editProduct } = require("../controller/admin/product/productController")
const catchAsync = require("../services/catchAsync")
const upload = multer({storage : storage})

const router = require("express").Router()

router.route("/product")
.post(isAuthenticated, restrictTo("admin"), upload.single('productImage'), catchAsync(createProduct))
.get(catchAsync(getProducts))

router.route("/product/:id")
.get(catchAsync(getProduct))
.patch(isAuthenticated, restrictTo("admin"), upload.single('productImage'), catchAsync(editProduct))
.delete(isAuthenticated,restrictTo("admin"), catchAsync(deleteProduct))

module.exports = router