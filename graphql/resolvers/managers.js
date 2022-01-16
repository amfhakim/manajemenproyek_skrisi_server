const Manager = require("../../models/Manager");
const Project = require("../../models/Project");
const checkAuth = require("../../utils/check-auth");
const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const { validateManagerInput } = require("../../utils/validators");

module.exports = {
  Query: {
    async getManagers() {
      try {
        const managers = await Manager.find().sort({ createdAt: -1 });
        return managers;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getManager(_, { managerId }) {
      try {
        const manager = await Manager.findById(managerId);
        if (manager) {
          return manager;
        } else {
          throw new Error("Manager not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createManager(_, { input }, context) {
      const user = checkAuth(context);
      const { valid, errors } = validateManagerInput(input);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const newManager = new Manager({
        ...input,
        createdAt: new Date().toISOString(),
      });

      const result = await newManager.save();
      return {
        ...result._doc,
        id: result._id,
      };
    },

    async updateManager(_, { managerId, input }, context) {
      const user = checkAuth(context);
      // make sure manager's name doesnt already exist
      const { nama } = input;
      let checkNama = false;
      if (nama) {
        const managerTarget = await Manager.findById(managerId);
        const managerCheck = await Manager.findOne({
          nama: { $regex: nama, $options: "i" },
        });
        if (managerCheck && managerCheck.nama !== managerTarget.nama) {
          checkNama = true;
        }
      }

      //validate input
      const { valid, errors } = validateManagerInput(input, checkNama);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //update data
      const result = await Manager.findByIdAndUpdate(
        { _id: managerId },
        input,
        {
          new: true,
        }
      );

      //update nama in project
      if (nama) {
        await Project.updateMany(
          { managerId: managerId },
          { namaManager: nama }
        );
      }
      return {
        ...result._doc,
        id: result._id,
      };
    },

    async deleteManager(_, { managerId }, context) {
      const user = checkAuth(context);
      try {
        const manager = await Manager.findById(managerId);
        await manager.delete();
        await Project.updateMany({ managerId: managerId }, { managerId: null });

        return "data manager berhasil dihapus";
      } catch (err) {
        throw new Error(err);
      }
    },

    async managerUpdateProjects(
      _,
      { managerId, projectIds, addOrDel },
      context
    ) {
      const manager = await Manager.findById(managerId);
      if (addOrDel) {
        //add project ids
        manager.projectIds.push(projectIds);
        await manager.save();
        for (i = 0; i < projectIds.length; i++) {
          await Project.findByIdAndUpdate(
            { _id: projectIds[i] },
            { managerId: managerId },
            { new: true }
          );
        }
      } else {
        //delete project ids
        const managerProjects = manager.projectIds;
        for (i = 0; i < projectIds.length; i++) {
          let index = managerProjects.indexOf(projectIds[i]);
          if (index > -1) {
            managerProjects.splice(index, 1);
          }
        }
        manager.projectIds = managerProjects;
        await manager.save();
        await Project.updateMany({ managerId: managerId }, { managerId: null });
      }
      return manager;
    },
  },

  Manager: {
    async projects(parent, args, context) {
      const projects = await Project.find({ managerId: parent._id });
      return projects;
    },
  },
};
