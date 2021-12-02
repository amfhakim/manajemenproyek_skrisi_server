const usersResolvers = require("./users");

module.exports = {
  Query: {
    ...usersResolvers.Query,
  },
};
