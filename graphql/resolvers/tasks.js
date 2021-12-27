const Task = require("../../models/Task");
const Project = require("../../models/Project");
const Material = require("../../models/Material");
const Tool = require("../../models/Tool");
const checkAuth = require("../../utils/check-auth");
const { validateTaskInput } = require("../../utils/validators");
const { UserInputError } = require("apollo-server-core");

module.exports = {
  Query: {
    async getTasksInProject(parent, { projectId }, context) {
      const user = checkAuth(context);
      try {
        const tasks = await Task.find({ projectId: projectId });
        return tasks;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createTask(parent, { projectId, input }, context) {
      const user = checkAuth(context);

      //validate project
      const project = await Project.findById(projectId);
      if (!project) {
        throw new UserInputError("task input error", {
          errors: {
            project: "project belum terdaftar",
          },
        });
      }

      //validate input
      let projectStartAt = project.startAt;
      let projectEndAt = project.endAt;
      const { valid, errors } = validateTaskInput(
        input,
        projectStartAt,
        projectEndAt
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //create new task
      const newTask = new Task({
        ...input,
        status: false,
        projectId: projectId,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      await newTask.save();

      //add taskId in project
      project.taskIds.push(newTask._id);
      project.save();

      return newTask;
    },

    async updateTask(parent, { taskId, input }, context) {
      const user = checkAuth(context);

      const task = await Task.findById(taskId);
      const project = await Project.findById(task.projectId);

      //validate input
      let projectStartAt = project.startAt;
      let projectEndAt = project.endAt;
      const { valid, errors } = validateTaskInput(
        input,
        projectStartAt,
        projectEndAt
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const updatedTask = await Task.findByIdAndUpdate({ _id: taskId }, input, {
        new: true,
      });
      return updatedTask;
    },

    async deleteTask(parent, { taskId }, context) {
      const user = checkAuth(context);

      const task = await Task.findById(taskId);
      const project = await Project.findById(task.projectId);

      await task.delete();

      const projectTasks = project.taskIds;
      let index = projectTasks.indexOf(taskId);
      if (index > -1) {
        projectTasks.splice(index, 1);
      }
      project.taskIds = projectTasks;
      await project.save();

      return "data pekerjaan berhasil dihapus";
    },
  },
  Task: {
    async project(parent, args, context) {
      const project = await Project.findById(parent.projectId);
      return project;
    },

    async materials(parent, args, context) {
      const materials = await Material.find({ taskId: parent.id });
      return materials;
    },

    async tools(parent, args, context) {
      const tools = await Tool.find({ taskId: parent.id });
      return tools;
    },
  },
};
