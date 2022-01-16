const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  name: String,
  managerId: {
    type: Schema.Types.ObjectId,
    ref: "managers",
  },
  createdAt: String,
  lastLoginAt: String,
});

module.exports = model("User", userSchema);
