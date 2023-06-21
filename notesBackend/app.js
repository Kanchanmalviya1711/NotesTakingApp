require("dotenv").config();
const express = require("express");
const app = express();
const createError = require("http-errors");
const connectDB = require("./db/dbconnection");
const auth = require("./routes/auth/auth.route");
const cors = require("cors");
const ProductsAll = require("./routes/Products/Products.route");
const NotesAll = require("./routes/Notes/Notes.route");

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("./uploads"));

// Routes
app.use("/", auth);
app.use("/products", ProductsAll);
app.use("/notes", NotesAll);

// 404 Error handler
app.use((req, res, next) => {
  next(createError(404, "Page Not Found"));
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 5000;

const server = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.log(error, "Error occurred");
  }
};

server();
