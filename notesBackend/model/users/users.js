const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

var GenderEnum = {
  values: ["Female", "Male", "Other"],
  message: "Gender is required.",
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "email must be provided"],
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    gender: { type: String, enum: GenderEnum },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
    ],
    role: {
      type: Boolean,
      required: true,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// hashing password

userSchema.pre("save", function (next) {
  console.log("bycript password hashing");
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 12);
    this.confirmPassword = bcrypt.hashSync(this.confirmPassword, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let newtoken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: newtoken });
    await this.save();
    return newtoken;
  } catch (error) {
    console.log(error);
  }
};
const User = mongoose.model("User", userSchema);
module.exports = User;
