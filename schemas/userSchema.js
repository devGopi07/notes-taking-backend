const validator = require("validator");
const mongoose =require('mongoose')
let UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "user" },    
    email: {
      type: String,
      required: true, 
      validate: (val) => {
        return validator.isEmail(val);
      },
    },
    password: { type: String, required: true }, 
    activation: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
  },
  {
    collection: "users",
    versionKey: false,
  }
);

let UserModel = mongoose.model("users", UserSchema);

module.exports = { UserModel };
