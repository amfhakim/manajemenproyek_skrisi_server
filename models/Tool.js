const { model, Schema } = require("mongoose");

const toolSchema = new Schema({
  nama: String,
  jumlah: String,
  hargaSewa: String,
  totalHarga: String,
  createdAt: String,
  username: String,
});

module.exports = model("Tool", toolSchema);
