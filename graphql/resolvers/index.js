const usersResolvers = require("./users");
const customersResolvers = require("./customers");
const managersResolvers = require("./managers");
const workersResolvers = require("./workers");
const projectsResolvers = require("./projects");
const presenceResolvers = require("./presence");
const taskResolvers = require("./tasks");
const materialsResolvers = require("./materials");
const toolsResolvers = require("./tools");

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...customersResolvers.Query,
    ...managersResolvers.Query,
    ...workersResolvers.Query,
    ...projectsResolvers.Query,
    ...presenceResolvers.Query,
    ...taskResolvers.Query,
    ...materialsResolvers.Query,
    ...toolsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...customersResolvers.Mutation,
    ...managersResolvers.Mutation,
    ...workersResolvers.Mutation,
    ...projectsResolvers.Mutation,
    ...presenceResolvers.Mutation,
    ...taskResolvers.Mutation,
    ...materialsResolvers.Mutation,
    ...toolsResolvers.Mutation,
  },
  Project: {
    ...projectsResolvers.Project,
  },
  Customer: {
    ...customersResolvers.Customer,
  },
  Manager: {
    ...managersResolvers.Manager,
  },
  Worker: {
    ...workersResolvers.Worker,
  },
  Presence: {
    ...presenceResolvers.Presence,
  },
  Task: {
    ...taskResolvers.Task,
  },
  Material: {
    ...materialsResolvers.Material,
  },
  Tool: {
    ...toolsResolvers.Tool,
  },
};
