const mongoose = require("mongoose");
const validator = require("validator");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 3,
  },
  email: {
    require: true,
    type: String,
    unique: [true, "email already present"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid email");
      }
    },
  },
  phone: { require: true, type: String, min: 10, unique: true },
  address: {
    type: String,
    required: true,
  },
});

//modal

const Student = new mongoose.model("Student", studentSchema);

module.exports = Student;
