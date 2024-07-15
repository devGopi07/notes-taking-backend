const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const secretKey = "avakfbajkdfajdngladfb";

const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(saltRounds);

  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (hashPassword, password) => {
  return await bcrypt.compare(hashPassword, password);
};

const createToken = async (payload) => {
  let token = await jwt.sign(payload, secretKey, { expiresIn: "5m" });
  return token;
};

const createForgetToken = async (payload) => {
  let tokenn = await jwt.sign(payload, secretKey, { expiresIn: "5m" });
  return tokenn;
};

const validate = async (req, res, next) => {
  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];
    let data = await jwt.decode(token);
    let currentTime = Math.floor(+new Date() / 1000);

    if (currentTime < data.exp) {
      next();
    } else {
      res.status(401).send({ message: "Token Expired Login Again!!!" });
    }
  } else {
    res.status(400).send({ message: "Token Not Found" });
  }
};

const roleCheck = async (req, res, next) => {
  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];
    let data = await jwt.decode(token);

    if (data.role === "admin") {
      next();
    } else {
      res.status(401).send({ message: "Only Admins Can Access" });
    }
  } else {
    res.status(400).send({ message: "Token Not Found" });
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
  createForgetToken,
  validate,
  roleCheck
};
