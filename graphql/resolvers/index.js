const usersResolvers = require("./users");
const customersResolvers = require("./customers");
const workersResolvers = require("./workers");
const projectsResolvers = require("./projects");
const presensiResolvers = require("./presensi");

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...customersResolvers.Query,
    ...workersResolvers.Query,
    ...projectsResolvers.Query,
    ...presensiResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...customersResolvers.Mutation,
    ...workersResolvers.Mutation,
    ...projectsResolvers.Mutation,
    ...presensiResolvers.Mutation,
  },
  Worker: {
    ...workersResolvers.Worker,
  },
  Presensi: {
    ...presensiResolvers.Presensi,
  },
};
