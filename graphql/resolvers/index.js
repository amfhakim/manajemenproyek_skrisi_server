const usersResolvers = require("./users");
const customersResolvers = require("./customers");
const workersResolvers = require("./workers");
const projectsResolvers = require("./projects");
const presenceResolvers = require("./presence");

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...customersResolvers.Query,
    ...workersResolvers.Query,
    ...projectsResolvers.Query,
    ...presenceResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...customersResolvers.Mutation,
    ...workersResolvers.Mutation,
    ...projectsResolvers.Mutation,
    ...presenceResolvers.Mutation,
  },
  Project: {
    ...projectsResolvers.Project,
  },
  Customer: {
    ...customersResolvers.Customer,
  },
  Worker: {
    ...workersResolvers.Worker,
  },
  Presence: {
    ...presenceResolvers.Presence,
  },
};
