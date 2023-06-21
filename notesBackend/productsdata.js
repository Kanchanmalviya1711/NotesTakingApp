require("dotenv").config();
const connectDB = require("./db/dbconnection");
const ProductJson = require("./products.json");
const Product = require("./model/product");

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await Product.create(ProductJson);
    console.log("success");
  } catch (error) {
    console.log(error, "error");
  }
};

start();
