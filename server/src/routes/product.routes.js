const express = require("express");
const upload = require("../middlewares/multer");
const router = express.Router();
const productController = require('../controllers/product.controller');
const { userAuthMiddleware } = require("../middlewares/auth.middleware");

router.post("/create", upload.array("images", 10), userAuthMiddleware, productController.createProduct);
router.get('/', productController.getLatestProducts);

module.exports = router;