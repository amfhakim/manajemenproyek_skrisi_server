const { model, Schema } = require("mongoose");

const workerSchema = new Schema({
  nama: String,
  alamat: String,
  notlp: String,
  email: String,
  jabatan: String,
  gaji: String,
  foto: String,
  presensi: {
    tanggal: String,
    kehadiran: Boolean,
  },
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

module.exports = model("Worker", workerSchema);
