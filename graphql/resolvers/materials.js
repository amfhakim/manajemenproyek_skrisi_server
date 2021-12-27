const Material = require("../../models/Material");
const Task = require("../../models/Task");
const checkAuth = require("../../utils/check-auth");
const { validateMaterialInput } = require("../../utils/validators");
const { UserInputError } = require("apollo-server-core");

module.exports = {
  Query: {
    async getMaterialsInTask(parent, { taskId }, context) {
      const user = checkAuth(context);
      try {
        const materials = await Material.find({ taskId: taskId });
        return materials;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createMaterial(parent, { taskId, input }, context) {
      const user = checkAuth(context);

      const { valid, errors } = validateMaterialInput(input);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const task = await Task.findById(taskId);
      if (!task) {
        throw new UserInputError("material input errors", {
          errors: {
            task: "pekerjaan belum terdaftar",
          },
        });
      }

      //create new material
      const newMaterial = new Material({
        ...input,
        status: false,
        taskId: taskId,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      await newMaterial.save();

      //add material id in task
      task.materialIds.push(newMaterial._id);
      await task.save();

      return newMaterial;
    },

    async updateMaterial(parent, { materialId, input }, context) {
      const user = checkAuth(context);

      const { valid, errors } = validateMaterialInput(input);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const material = await Material.findByIdAndUpdate(
        { _id: materialId },
        input,
        { new: true }
      );
      return material;
    },

    async deleteMaterial(parent, { materialId }, context) {
      const user = checkAuth(context);

      const material = await Material.findById(materialId);
      const task = await Task.findById(material.taskId);

      await material.delete();

      const taskMaterials = task.materialIds;
      let index = taskMaterials.indexOf(materialId);
      if (index > -1) {
        taskMaterials.splice(index, 1);
      }
      task.materialIds = taskMaterials;
      await task.save();

      return "data material berhasil dihapus";
    },
  },
  Material: {
    async task(parent, args, context) {
      const task = await Task.findById(parent.taskId);
      return task;
    },
  },
};
