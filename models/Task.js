const { model, Schema } = require("mongoose");

const taskSchema = new Schema({
  nama: String,
  pj: String,
  startAt: String,
  endAt: String,
  progres: String,
  materialIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "materials",
    },
  ],
  toolIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "tools",
    },
  ],
  projectId: {
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
