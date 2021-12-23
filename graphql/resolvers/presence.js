const Worker = require("../../models/Worker");
const Presence = require("../../models/Presence");
const checkAuth = require("../../utils/check-auth");
const { validatePresenceInput } = require("../../utils/validators");
const { AuthenticationError, UserInputError } = require("apollo-server-errors");

module.exports = {
  Query: {
    async getPresence(_, args, context) {
      const presence = await Presence.find();
      return presence;
    },
  },
  Mutation: {
    async createPresence(_, { workerId, input }, context) {
      //tanggal masih error(tanggalnya jadi -1), tapi udah lancar diinput
      const user = checkAuth(context);
      const { tanggal, kehadiran } = input;

      //validasi worker & tanggal
      const worker = await Worker.findById(workerId);
      if (worker) {
        const { valid, errors } = validatePresenceInput(tanggal);
        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }

        //membuat presence baru
        const newPresence = new Presence({
          worker: workerId,
          tanggal: new Date(tanggal).toString(),
          kehadiran: kehadiran,
          user: user.id,
          username: user.username,
          createdAt: new Date().toISOString(),
        });

        await newPresence.save();
        return newPresence;
      }
    },
  },
  Presence: {
    async worker(parent, args, context) {
      console.log(parent.worker);
      const worker = await Worker.find({ _id: parent.worker });
      return worker;
    },
  },
};
