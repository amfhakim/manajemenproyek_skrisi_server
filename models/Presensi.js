const { model, Schema } = require("mongoose");

const presensiSchema = new Schema({
  worker: {
    type: Schema.Types.ObjectId,
    ref: "workers",
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

module.exports = model("Presensi", presensiSchema);
