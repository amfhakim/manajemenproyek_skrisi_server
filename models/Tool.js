const { model, Schema } = require("mongoose");

const toolSchema = new Schema({
  nama: String,
  jumlah: String,
  hargaSewa: String,
  totalHarga: String,
  createdAt: String,
  username: String,
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "tasks",
  },
});

module.exports = model("Tool", toolSchema);
