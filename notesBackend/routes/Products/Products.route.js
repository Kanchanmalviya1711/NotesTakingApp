const express = require("express");
const router = express.Router();
const ProductsController = require("../../controllers/products.controller");
const authentication = require("../../middleware/authentication");

//get products =>GET AllProducts
router.get("/", ProductsController.getAllProducts);

//get product by id =>GET ProductById
router.get("/:id", ProductsController.getOneProduct);

// post products => POST product
router.post("/", authentication, ProductsController.addProduct);

//update product =>PUT Product
router.put("/:id", ProductsController.updateProduct);

//get products =>DELETE delete product
router.delete("/:id", ProductsController.deleteProduct);

module.exports = router;
