const Product = require('../models/Products')
const asyncHandler = require('express-async-handler')

const getAllProducts = asyncHandler( async (req,res) => {
    const products = await Product.find().lean()
    if(!products?.length){
        return res.status(400).json({message : 'No Products Found'})
    }
    res.json(products)
})

const addProduct = asyncHandler( async (req,res) => {

    const { productName, productPrice } = req.body


    // Check for duplicate productname
    const duplicate = await Product.findOne({ productName }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    const productObject = { productName , productPrice }

    const product = await Product.create(productObject)

    if (product) { //created 
        res.status(201).json({ message: `New product ${productName} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the id from the URL params

    if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    // Query by productId, not _id
    const product = await Product.findOne({ productId: id }).exec();

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
});


const updateProduct = asyncHandler( async(req,res) => {
    const { productName, productPrice } = req.body

    if(!productName){
        return res.status(400).json({ message : "Enter Product Name "})
    }

    // Does the user exist to update?
    const product = await Product.findOne({ productName }).exec()

    if (!product) {
        return res.status(400).json({ message: 'User not found' })
    }

    product.productPrice = productPrice

    const updatedProduct = await product.save()

    res.json({ message: `${updatedProduct.productName} updated` })
})

const deleteProduct = asyncHandler( async ( req, res) => {
    const { productName } = req.body;

    // Confirm data
    if (!productName) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user exist to delete?
    const product = await Product.findOne({productName}).exec()

    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }

    const result = await product.deleteOne()

    const reply = `Username ${result.productName} deleted`

    res.json(reply)

})

module.exports = {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById
}