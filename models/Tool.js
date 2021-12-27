const { model, Schema } = require("mongoose");

const toolSchema = new Schema({
  nama: String,
  jumlah: Number,
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

module.exports = model("Tool", toolSchema);
