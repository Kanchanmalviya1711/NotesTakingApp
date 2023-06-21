const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb://localhost:27017/studentapi",
      {
        useUnifiedTopology: true,

        useCreateIndex: true,
        useNewUrlParser: true,
      }
    );
    console.log(conn, "connected");
  } catch (error) {
    console.log(error, "error");
  }
};

module.exports = connectDB;
