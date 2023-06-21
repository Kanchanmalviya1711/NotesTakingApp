const mongoose = require("mongoose");

const connectDB = async (uri) => {
  try {
    mongoose.connect(await uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.set("strictQuery", false);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to db");
});

mongoose.connection.on("error", (error) => {
  console.error(error.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from db");
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("Db Terminated...");
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
});

module.exports = connectDB;
