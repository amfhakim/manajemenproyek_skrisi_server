const Tool = require("../../models/Tool");
const Task = require("../../models/Task");
const checkAuth = require("../../utils/check-auth");
const { validateToolInput } = require("../../utils/validators");
const { UserInputError } = require("apollo-server-core");

module.exports = {
  Query: {
    async getToolsInTask(parent, { taskId }, context) {
      const user = checkAuth(context);
      try {
        const tools = await Tool.find({ taskId: taskId });
        return tools;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getTool(parent, { toolId }, context) {
      const user = checkAuth(context);
      try {
        const tool = await Tool.findById(toolId);
        return tool;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createTool(parent, { taskId, input }, context) {
      const user = checkAuth(context);

      const { valid, errors } = validateToolInput(input);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const task = await Task.findById(taskId);
      if (!task) {
        throw new UserInputError("tool input errors", {
          errors: {
            task: "pekerjaan belum terdaftar",
          },
        });
      }

      //create new tool
      const newTool = new Tool({
        ...input,
        status: false,
        taskId: taskId,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      await newTool.save();

      //add tool id in task
      task.toolIds.push(newTool._id);
      await task.save();

      return newTool;
    },

    async updateTool(parent, { toolId, input }, context) {
      const user = checkAuth(context);

      const { valid, errors } = validateToolInput(input);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const tool = await Tool.findByIdAndUpdate({ _id: toolId }, input, {
        new: true,
      });
      return tool;
    },

    async deleteTool(parent, { toolId }, context) {
      const user = checkAuth(context);

      const tool = await Tool.findById(toolId);
      const task = await Task.findById(tool.taskId);

      await tool.delete();

      const taskTools = task.toolIds;
      let index = taskTools.indexOf(toolId);
      if (index > -1) {
        taskTools.splice(index, 1);
      }
      task.toolIds = taskTools;
      await task.save();

      return "data peralatan berhasil dihapus";
    },
  },
  Tool: {
    async task(parent, args, context) {
      const task = await Task.findById(parent.taskId);
      return task;
    },
  },
};
