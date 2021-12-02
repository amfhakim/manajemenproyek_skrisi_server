const User = require("../../models/User");

module.exports = {
  Query: {
    Hello: (parent, args, context) => "zaa warudoo",

    async getUsers() {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
