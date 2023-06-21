const User = require("../model/users/users");
require("../db/dbconnection");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const generateToken = require("../utils/token");

const displayMsg = async (req, res) => {
  await res.send("Hello Backend From Servers Side");
};
//Registration
const signupPage = async (req, res) => {
  const { name, email, phone, password, confirmPassword, gender } = req.body;

  if (!name || !email || !phone || !password || !confirmPassword || !gender) {
    return res
      .status(422)
      .json({ error: "Please fill in all the required fields" });
  }

  try {
    const exist = await User.findOne({ email: email });
    if (exist) {
      return res.status(422).json({ error: "Email Already Exists" });
    } else if (password !== confirmPassword) {
      return res
        .status(422)
        .json({ error: "Password and Confirm Password must match" });
    } else {
      const uniqueKey = uuidv4();
      console.log(uniqueKey, "generate unique id");
      const user = new User({
        uniqueKey, // Save the uniqueKey for the user
        name,
        email,
        phone,
        password,
        confirmPassword,
        gender,
      });

      const savedUser = await user.save();
      if (savedUser) {
        res
          .status(201)
          .json({ savedUser, msg: "User Registered Successfully" });
      } else {
        res.status(500).json({ error: "Failed to register user" });
      }
      console.log(savedUser, "save unique key");
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
};

//Login
const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in the data" });
    }

    const loginExist = await User.findOne({ email: email });

    if (loginExist) {
      const isMatch = await bcrypt.compare(password, loginExist.password);
      if (isMatch) {
        const token = generateToken(loginExist._id);
        console.log(token, "xnfgchxzfyd");
        const { _id, name, email, gender, uniqueKey } = loginExist;

        const user = {
          uniqueKey: uniqueKey,
          id: _id,
          name: name,
          email: email,
          gender: gender,
          token: token,
        };

        console.log(user, "data");
        return res.status(200).json({
          success: true,
          message: "User Login Successfully",
          user,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Credentials" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error, "error");
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
};

// get Logged InUser Info

const getLoggedInUserInfo = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "protected",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
};

module.exports = {
  displayMsg,
  signupPage,
  loginPost,
  getLoggedInUserInfo,
};

//how to add a product in a cart using redux toolkit?
