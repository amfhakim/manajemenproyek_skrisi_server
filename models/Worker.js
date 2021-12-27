const { model, Schema } = require("mongoose");

const workerSchema = new Schema({
  nama: String,
  alamat: String,
  notlp: String,
  email: String,
  foto: String,
  presenceIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "presences",
    },
  ],
  projectIds: [
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

module.exports = model("Worker", workerSchema);
