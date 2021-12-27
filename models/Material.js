const { model, Schema } = require("mongoose");

const materialSchema = new Schema({
  nama: String,
  jenis: String,
  jumlah: Number,
  satuan: String,
  status: Boolean,
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "tasks",
  },
  createdAt: String,
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Material", materialSchema);
