const { model, Schema } = require("mongoose");

const presenceSchema = new Schema({
  workerId: {
    type: Schema.Types.ObjectId,
    ref: "workers",
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "projects",
  },
  tanggal: String,
  kehadiran: Boolean,
  createdAt: String,
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Presence", presenceSchema);
