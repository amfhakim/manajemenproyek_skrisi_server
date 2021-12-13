const Worker = require("../../models/Worker");
const Presensi = require("../../models/Presensi");
const checkAuth = require("../../utils/check-auth");
const { validatePresensiInput } = require("../../utils/validators");
const { AuthenticationError, UserInputError } = require("apollo-server-errors");

module.exports = {
  Query: {
    async getPresensi(_, { workerId }, context) {
      const { username } = checkAuth(context);

      const worker = await Worker.findById(workerId);
      if (worker) {
        if (worker.username === username) {
          //sampai saat ini baru admin yg bisa ?
          const presensi = await Presensi.find({ workerId: workerId });
          return presensi;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("worker not found");
      }
    },
  },
  Mutation: {
    async createPresensi(_, { workerId, input }, context) {
      //tanggal masih error(tanggalnya jadi -1), tapi udah lancar diinput
      const user = checkAuth(context);
      const { tanggal, kehadiran } = input;

      //validasi worker & tanggal
      const worker = await Worker.findById(workerId);
      if (worker) {
        const { valid, errors } = validatePresensiInput(tanggal);
        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }

        //membuat presensi baru
        const newPresensi = new Presensi({
          worker: workerId,
          tanggal: new Date(tanggal).toString(),
          kehadiran: kehadiran,
          user: user.id,
          username: user.username,
          createdAt: new Date().toISOString(),
        });

        await newPresensi.save();
        return newPresensi;
      }
    },
  },
  Presensi: {
    async worker({ parent }, args, context) {
      console.log(parent._id);
      const worker = await Worker.find({ _id: parent.workerId });
      return worker;
    },
  },
};
