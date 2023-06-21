const express = require("express");
const router = express.Router();
const {
  displayMsg,
  signupPage,
  loginPost,
  getLoggedInUserInfo,
} = require("../../controllers/user.controller");
const authentication = require("../../middleware/authentication");

router.get("/", displayMsg);

//register
router.post("/register", signupPage);

//login
router.post("/login", loginPost);

//get logged in user info
router.get("/userinfo", authentication, getLoggedInUserInfo);

module.exports = router;
