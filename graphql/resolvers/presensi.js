const Worker = require("../../models/Worker");
const Presensi = require("../../models/Presensi");
const checkAuth = require("../../utils/check-auth");
const { validatePresensiInput } = require("../../utils/validators");
const { AuthenticationError, UserInputError } = require("apollo-server-errors");

module.exports = {
  Query: {
    async getPresensi(_, args, context) {
      const presensi = await Presensi.find();
      return presensi;
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
    async worker(parent, args, context) {
      console.log(parent.worker);
      const worker = await Worker.find({ _id: parent.worker });
      return worker;
    },
  },
};
