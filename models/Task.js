const { model, Schema } = require("mongoose");

const taskSchema = new Schema({
  nama: String,
  pj: String,
  startAt: String,
  endAt: String,
  progres: String,
  materials: [
    {
      type: Schema.Types.ObjectId,
      ref: "materials",
    },
  ],
  tools: [
    {
      type: Schema.Types.ObjectId,
      ref: "tools",
    },
  ],
  project: {
    type: Schema.Types.ObjectId,
    ref: "projects",
  },
  createdAt: String,
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Task", taskSchema);
