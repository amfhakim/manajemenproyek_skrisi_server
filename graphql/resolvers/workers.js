const Worker = require("../../models/Worker");
const Presensi = require("../../models/Presensi");
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
        if (user.username === worker.username) {
          await worker.delete();
          return "data pekerja berhasil dihapus";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Worker: {
    async presensi({ parent }, args, context) {
      console.log(parent);
      const presen = await Presensi.find({ workerId: parent.id });
      console.log(parent.id);
      return presen;
    },
  },
};
