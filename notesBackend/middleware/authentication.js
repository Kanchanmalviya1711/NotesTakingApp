const jwt = require("jsonwebtoken");
const User = require("../model/users/users");

const authentication = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token, authorization denied" });
    }
    const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
    console.log(decodedToken, "decode");

    req.user = decodedToken.id;
    const id = req.user;

    const verifiedUser = await User.findOne({ _id: id });
    if (!verifiedUser || verifiedUser.role !== false) {
      return res.status(401).send({
        success: false,
        message: "Bad token, authorization denied",
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = authentication;
