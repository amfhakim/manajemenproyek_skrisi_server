const { model, Schema } = require("mongoose");

const costumerSchema = new Schema({
  nama: String,
  alamat: String,
  notlp: String,
  email: String,
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "projects",
    },
  ],
  createdAt: String,
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Costumer", costumerSchema);
