const Worker = require("../../models/Worker");
const Project = require("../../models/Project");
const Presence = require("../../models/Presence");
const checkAuth = require("../../utils/check-auth");
const { validatePresenceInput } = require("../../utils/validators");
const { AuthenticationError, UserInputError } = require("apollo-server-errors");

module.exports = {
  Query: {
    async getPresencesInWorkers(_, { workerIds, input }, context) {
      const user = checkAuth(context);
      const { tanggalMulai, tanggalSelesai } = input;

      const presence = await Presence.find({
        workerId: { $in: workerIds },
        tanggal: {
          $gte: new Date(tanggalMulai).toISOString(),
          $lte: new Date(tanggalSelesai).toISOString(),
        },
      });
      return presence;
    },

    async getPresencesInProject(_, { projectId, input }, context) {
      const user = checkAuth(context);
      const { tanggalMulai, tanggalSelesai } = input;

      const presence = await Presence.find({
        projectId: projectId,
        tanggal: {
          $gte: new Date(tanggalMulai).toISOString(),
          $lte: new Date(tanggalSelesai).toISOString(),
        },
      });
      return presence;
    },
  },

  Mutation: {
    async createPresence(_, { workerId, projectId, input }, context) {
      //tanggal masih error(tanggalnya jadi -1), tapi udah lancar diinput
      const user = checkAuth(context);
      const { tanggal, kehadiran } = input;

      //validasi worker, project & tanggal
      const worker = await Worker.findById(workerId);
      const project = await Project.findById(projectId);
      const errors = {};
      if (worker && project) {
        if (worker.projectIds.includes(projectId)) {
          const { valid, errors } = validatePresenceInput(tanggal);
          if (!valid) {
            throw new UserInputError("Errors", { errors });
          }

          //membuat presence baru
          const newPresence = new Presence({
            workerId: workerId,
            projectId: projectId,
            tanggal: new Date(tanggal).toISOString(),
            kehadiran: kehadiran,
            user: user.id,
            username: user.username,
            createdAt: new Date().toISOString(),
          });
          await newPresence.save();

          //memasukkan id presence ke worker ybs
          worker.presenceIds.push(newPresence._id);
          await worker.save();

          return newPresence;
        } else {
          errors.presensi = `${worker.nama} tidak bekerja di proyek ${project.nama}`;
          throw new UserInputError("presence input error", { errors });
        }
      } else {
        errors.presensi = `worker atau project tidak ada`;
        throw new UserInputError("presence input error", { errors });
      }
    },

    async updatePresence(_, { workerId, projectId, input }, context) {
      const user = checkAuth(context);
      const { tanggal, kehadiran } = input;

      const presence = await Presence.findOne({
        workerId: workerId,
        projectId: projectId,
        tanggal: new Date(tanggal).toISOString(),
      });
      presence.kehadiran = kehadiran;
      await presence.save();
      return presence;
    },
  },

  Presence: {
    async worker(parent, args, context) {
      const worker = await Worker.findById(parent.workerId);
      return worker;
    },
    async project(parent, args, context) {
      const project = await Project.findById(parent.projectId);
      return project;
    },
  },
};
