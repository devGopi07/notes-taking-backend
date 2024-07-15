var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../schemas/userSchema");
const mongoose = require("mongoose");
const { dbUrl } = require("../common/dbConfig");
const {
  hashPassword,
  comparePassword,
  createToken,
  validate,
  createForgetToken,
  roleCheck,
} = require("../common/auth");
const { SendResetEmail } = require("./MailSender");

mongoose.connect(dbUrl);

/* GET users listing. */

//GET ALL
router.get("/getAll", validate, roleCheck, async (req, res, next) => {
  try {
    let user = await UserModel.find({});
    res
      .status(200)
      .send({ message: "User Data Fetched Successfully!!!", user });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

//SignUP
router.post("/signUp", async (req, res, next) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      let hashedPassword = await hashPassword(req.body.password);
      req.body.password = hashedPassword;
      let user = await UserModel.create(req.body);

      let token = await createForgetToken({
        name: user.name,
        email: user.email,
      });

      //send mail
      const url = `https://note-taking-application-frontend.netlify.app/signUpActivation/${token}`;
      const name = user.name;
      const email = user.email;
      SendResetEmail(email, url, "Activate Your Account", name);

      res.status(200).send({ message: "User Signup Successfull !!! Please Activate Your Account !!!",user,token });
    } else {
      res.status(400).send({ message: "User Already Exists" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

//SignUpActivation
router.post("/signUpActivation", async (req, res, next) => {
  try {
    let tokenn = await jwt.decode(req.body.token);
    req.body.token = tokenn.email;

    let data = await UserModel.findOneAndUpdate(
      { email: req.body.token },
      { activation: true }
    );
    res.status(200).send({ message: "Email Successfully Verified !!!", data });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

//Login
router.post("/signIn", async (req, res, next) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      if (user.activation === true) {
        if (await comparePassword(req.body.password, user.password)) {
          let token = await createToken({
            name: user.name,
            role: user.role,
            id: user._id,
            email: user.email,
          });
          let role = user.role;
          let email = user.email;
        res
          .status(200)
          .send({ message: "User Login Successfull !!!", token, role, email }); 
        } else {
          res.status(402).send({ message: "Invalid Password" });
        }
      } else {
        console.log(user.email);
        let token = await createForgetToken({
          name: user.name,
          email: user.email, 
        }); 
        //send mail
        const url = `https://note-taking-application-frontend.netlify.app/signUpActivation/${token}`;
        const name = user.name;
        const email = user.email;
        SendResetEmail(email, url, "Activate Your Account", name);

        res.status(402).send({
          message:
            "Please Activate Your Account, An Email Already Sent To Your Mail Id.",
          token,
        });
      }
    } else {
      res.status(403).send({ message: "User Doesn't Exists" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Errors", error });
  }
});

//DELETE
router.delete("/deleteUser/:id", async (req, res, next) => {
  try {
    let user = await UserModel.findOne({ _id: req.params.id });
    if (user) {
      let user = await UserModel.deleteOne({ _id: req.params.id });
      res.status(200).send({ message: "User Deleted Successfully !!!", user });
    } else {
      res.status(403).send({ message: "User Doesn't Exists" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Errors", error });
  }
});

//Forgot Password
router.post("/forgetPassword", async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      //create token
      let token = await createForgetToken({ id: user._id });

      //send mail
      const url = `https://note-taking-application-frontend.netlify.app/reset-password/${token}`;
      const name = user.name;
      const email = user.email;
      SendResetEmail(email, url, "Reset Your Password", name);

      //success
      res
        .status(200)
        .send({ message: "Link Has Been Sent To Your Email Id", token });
    } else {
      res.status(400).send({ message: "Invalid User" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

//Reset Password
router.post("/resetPassword", async (req, res) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      let data = await jwt.decode(token);
      let currentTime = Math.floor(+new Date() / 1000);
      if (currentTime < data.exp) {
        let hashedPassword = await hashPassword(req.body.password);
        let user = data;

        let updatedData = await UserModel.findOneAndUpdate(
          { _id: user.id },
          { password: hashedPassword }
        );
        res.status(200).send({ message: "Password Changed Successfully !!!" });
      } else {
        res.status(401).send({ message: "Token Expired Try Again" });
      }
    } else {
      res.status(401).send({ message: "Token Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});
module.exports = router;
