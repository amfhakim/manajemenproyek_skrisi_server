const { model, Schema } = require("mongoose");

const projectSchema = new Schema({
  nama: String,
  alamat: String,
  startAt: String,
  endAt: String,
  progres: Number,
  taskIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "tasks",
    },
  ],
  namaWorkers: [String],
  workerIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "workers",
    },
  ],
  namaCustomer: String,
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "customers",
  },
  namaManager: String,
  managerId: {
    type: Schema.Types.ObjectId,
    ref: "managers",
  },
  createdAt: String,
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Project", projectSchema);
