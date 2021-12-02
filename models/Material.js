const { model, Schema } = require("mongoose");

const materialSchema = new Schema({
  nama: String,
  jenis: String,
  jumlah: String,
  satuan: String,
  harga: String,
  totalHarga: String,
  task: {
    type: Schema.Types.ObjectId,
    ref: "tasks",
  },
});

module.exports = model("Material", materialSchema);
