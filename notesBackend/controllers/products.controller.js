const allProducts = require("../model/allProducts/Products");
const createError = require("http-errors");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { default: mongoose } = require("mongoose");
const User = require("../model/users/users");

const imgConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only images are allowed"));
  }
};

const uploadImage = multer({
  storage: imgConfig,
  fileFilter: isImage,
}).single("image"); // Specify the field name for the uploaded image

module.exports = {
  getAllProducts: async (req, res, next) => {
    try {
      const results = await allProducts.find({}, { __v: 0 }).sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        productsCount: results.length,
        products: results,
      });
    } catch (error) {
      console.error(error.message);
      next(new Error("Unable to get products"));
    }
  },

  addProduct: async (req, res, next) => {
    try {
      // Upload the image and handle the request
      uploadImage(req, res, async (error) => {
        if (error) {
          return res.status(422).json({ error: error.message });
        }
        const file = req.file;
        const {
          name,
          category,
          company,
          price,
          quantity,
          description,
          rating,
          colors,
          in_stock,
          user,
        } = req.body;

        if (
          !name ||
          !category ||
          !company ||
          !price ||
          !quantity ||
          !description ||
          !file ||
          !rating ||
          !colors ||
          !in_stock ||
          !user
        ) {
          return res
            .status(422)
            .json({ error: "Please fill in all the required fields" });
        }

        try {
          // Upload the image to Cloudinary
          const result = await cloudinary.uploader.upload(file.path);
          const color = colors;
          const colorArraySplit = color.split(",");
          const colorArray = colorArraySplit.map((color) => color.trim());

          console.log(colorArray, "colorarray");
          const existUser = await User.findById(user);
          console.log(existUser, "existuser");
          if (!existUser) {
            return res.status(404).json({
              success: false,
              message: "Unable to find user.",
            });
          }

          // Create the product
          const createProduct = new allProducts({
            name,
            category,
            company,
            price,
            quantity,
            description,
            image: result.secure_url,
            rating,
            colors: colorArray,
            in_stock,
            user: existUser?._id,
          });

          const session = await mongoose.startSession();
          session.startTransaction();

          existUser.products.push(createProduct);
          await existUser.save({ session });
          await session.commitTransaction();

          await createProduct.save({ session });

          const savedProduct = await createProduct.save();

          if (savedProduct) {
            res.status(201).json({
              success: true,
              message: "Product created successfully",
            });
          } else {
            res.status(500).json({ error: "Failed to create the product" });
          }
        } catch (error) {
          console.error(error.message);
          if (error.name === "ValidationError") {
            next(createError(422, error.message));
          } else {
            next(error);
          }
        }
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  getOneProduct: async (req, res, next) => {
    const id = req?.params?.id;
    try {
      // Find the product with the specified id using the `findById` method of the `allproducts` model.
      const results = await allProducts.findById(id, { __v: 0 });
      // Check if results is null or undefined. If so, throw a 404 error.
      if (!results) {
        throw createError(404, "Product does not exist.");
      }
      // If results is not null or undefined, send it back to the client.
      res.send(results);
    } catch (error) {
      console.log(error.message, "Single product error");
      // Check if the error is a `CastError` thrown by Mongoose when the id is not a valid ObjectId.
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Product Id"));
        return;
      }
      // If the error is not a `CastError`, pass it on to the next error handler.
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    const id = req.params.id;
    const update = req.body;
    const options = { new: true };
    try {
      const result = await allProducts.findByIdAndUpdate(id, update, options);
      if (result) {
        res
          .status(200)
          .json({ success: true, message: "Product Update Successfully" });
      } else if (!result) {
        throw createError(404, "Product does not exist.");
      } else {
        res.status(500).json({ error: "Failed to update product" });
      }
    } catch (error) {
      console.error(error.message, "update error");
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Product Id"));
        return;
      }
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await allProducts.findByIdAndDelete(id);
      if (result) {
        res
          .status(200)
          .json({ success: true, message: "Product Delete Successfully" });
      } else if (!result) {
        throw createError(404, "Product does not exist.");
      } else {
        res.status(500).json({ error: "Failed to delete product" });
      }
    } catch (error) {
      console.error(error.message, "delete error");
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Product Id"));
        return;
      }
      next(error);
    }
  },
};
