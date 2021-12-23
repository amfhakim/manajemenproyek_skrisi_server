const Worker = require("../../models/Worker");
const Presence = require("../../models/Presence");
const Project = require("../../models/Project");
const checkAuth = require("../../utils/check-auth");
const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const { validateWorkerInput } = require("../../utils/validators");

module.exports = {
  Query: {
    async getWorkers() {
      try {
        const workers = await Worker.find().sort({ createdAt: -1 });
        return workers;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getWorker(_, { workerId }) {
      try {
        const worker = await Worker.findById(workerId);
        if (worker) {
          return worker;
        } else {
          throw new Error("Worker not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createWorker(_, { input }, context) {
      const user = checkAuth(context);

      // make sure worker's name doesnt already exist
      const { nama } = input;
      let checkNama = false;
      if (nama) {
        const workerCheck = await Worker.findOne({
          nama: { $regex: nama, $options: "i" },
        });
        if (workerCheck) {
          checkNama = true;
        }
      }

      //validate input
      const { valid, errors } = validateWorkerInput(input, checkNama);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //create new data
      const newWorker = new Worker({
        ...input,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      await newWorker.save();
      return newWorker;
    },

    async updateWorker(_, { workerId, input }, context) {
      const user = checkAuth(context);
      // make sure worker's name doesnt already exist
      const { nama } = input;
      let checkNama = false;
      if (nama) {
        const workerTarget = await Worker.findById(workerId);
        const workerCheck = await Worker.findOne({
          nama: { $regex: nama, $options: "i" },
        });
        if (workerCheck && workerCheck.nama !== workerTarget.nama) {
          checkNama = true;
        }
      }

      //validate input
      const { valid, errors } = validateWorkerInput(input, checkNama);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //update data
      const result = await Worker.findByIdAndUpdate({ _id: workerId }, input, {
        new: true,
      });
      return {
        ...result._doc,
        id: result._id,
      };
    },

    async deleteWorker(_, { workerId }, context) {
      const user = checkAuth(context);
      try {
        const worker = await Worker.findById(workerId);
        //delete worker id and name in projects
        for (i = 0; i < worker.projectIds.length; i++) {
          const project = await Project.findById(worker.projectIds[i]);
          const projectWorkersIds = project.workerIds;
          const projectWorkersNames = project.namaWorkers;
          for (i = 0; i < project.workerIds.length; i++) {
            let index = projectWorkersIds.indexOf(workerId);
            let indexn = projectWorkersNames.indexOf(worker.nama);
            if (index > -1) {
              projectWorkersIds.splice(index, 1);
            }
            if (indexn > -1) {
              projectWorkersNames.splice(indexn, 1);
            }
          }
          project.workerIds = projectWorkersIds;
          project.namaWorkers = projectWorkersNames;
          await project.save();
        }
        //delete worker
        await worker.delete();

        return "data pekerja berhasil dihapus";
      } catch (err) {
        throw new Error(err);
      }
    },

    async workerUpdateProjects(_, { workerId, projectIds, addOrDel }, context) {
      const worker = await Worker.findById(workerId);
      if (addOrDel) {
        //add project ids
        for (i = 0; i < projectIds.length; i++) {
          worker.projectIds.push(projectIds[i]);
          const project = await Project.findById(projectIds[i]);
          project.workerIds.push(workerId);
          await project.save();
        }
        await worker.save();
      } else {
        //delete project ids
        const workerProjects = worker.projectIds;
        for (i = 0; i < projectIds.length; i++) {
          let index = workerProjects.indexOf(projectIds[i]);
          if (index > -1) {
            workerProjects.splice(index, 1);
          }
          const project = await Project.findById(projectIds[i]);
          const projectWorkers = project.workerIds;
          for (j = 0; j < project.workerIds.length; j++) {
            let indexw = projectWorkers.indexOf(project.workerIds[j]);
            if (indexw > -1) {
              projectWorkers.splice(index, 1);
            }
          }
          project.workerIds = projectWorkers;
          project.save();
        }
        worker.projectIds = workerProjects;
        await worker.save();
      }
      return worker;
    },
  },

  Worker: {
    async presence(parent, args, context) {
      const presence = await Presence.find({ workerId: parent._id });
      return presence;
    },

    async projects(parent, args, context) {
      const projects = await Project.find({
        _id: parent.projectIds.map((n) => {
          return n;
        }),
      });
      return projects;
    },
  },
};
