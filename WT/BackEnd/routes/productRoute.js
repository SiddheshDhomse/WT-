const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController')


router.route('/')
    .get(productController.getAllProducts)
    .post(productController.addProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct)

router.route('/:type')
    .get(productController.getProductById)

module.exports = router