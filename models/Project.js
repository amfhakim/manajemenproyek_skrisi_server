const { model, Schema } = require("mongoose");

const projectSchema = new Schema({
  nama: String,
  alamat: String,
  budget: String,
  startAt: String,
  endAt: String,
  progres: String,
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "tasks",
    },
  ],
  namaWorkers: [String],
  workers: [
    {
      type: Schema.Types.ObjectId,
      ref: "workers",
    },
  ],
  namaCostumer: String,
  costumer: {
    type: Schema.Types.ObjectId,
    ref: "costumers",
  },
  createdAt: String,
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Project", projectSchema);
