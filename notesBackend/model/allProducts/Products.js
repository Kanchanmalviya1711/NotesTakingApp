const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CategoryEnum = {
  values: [
    "Phone",
    "Fruits",
    "Vegetable",
    "Watch",
    "Tv",
    "Clothes",
    "Grocery",
    "Others",
    "Cosmetics",
  ],
  message: "Category is required.",
};

const getProductsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: CategoryEnum,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    rating: {
      type: Number,
      required: true,
    },
    colors: {
      type: Array, // Array of strings
      default: ["#ff0000", "#000000", "#CDD0D0"], // Default value is ["#ff0000", "#000000", "#CDD0D0"]
      required: true,
    },
    in_stock: {
      type: Boolean,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user id is required."],
    },
  },
  {
    timestamps: true,
  }
);

const allProducts = mongoose.model("products", getProductsSchema);
module.exports = allProducts;
