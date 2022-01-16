const { model, Schema } = require("mongoose");

const managerSchema = new Schema({
  nama: String,
  alamat: String,
  notlp: String,
  email: String,
  projectIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "projects",
    },
  ],
  createdAt: String,
  username: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Manager", managerSchema);
