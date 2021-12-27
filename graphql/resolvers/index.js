const usersResolvers = require("./users");
const customersResolvers = require("./customers");
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
