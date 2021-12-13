const Project = require("../../models/Project");
const Customer = require("../../models/Customer");
const Worker = require("../../models/Worker");
const checkAuth = require("../../utils/check-auth");
const { validateProjectInput } = require("../../utils/validators");
const { AuthenticationError, UserInputError } = require("apollo-server-errors");

module.exports = {
  Query: {
    async getProjects() {
      try {
        const projects = await Project.find().sort({ createdAt: -1 });
        return projects;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getProject(_, { projectId }) {
      try {
        const project = await Project.findById(projectId);
        if (project) {
          return project;
        } else {
          throw new Error("Project not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createProject(
      _,
      {
        input: {
          nama,
          alamat,
          namaCustomer,
          budget,
          startAt,
          endAt,
          namaWorkers,
        },
      },
      context
    ) {
      const user = checkAuth(context);
      //input tidak boleh kosong
      const { valid, errors } = validateProjectInput(
        nama,
        alamat,
        namaCustomer
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //validate customer, kalau belum terdaftar, daptar dulu bos
      const customer = await Customer.findOne({ nama: namaCustomer });
      if (!customer) {
        throw new UserInputError("customer belum terdaftar", {
          errors: {
            customer: "customer belum terdaftar",
          },
        });
      }

      //validate workers
      //(dah bisa, tapi kalau pakai try-catch bisa gak wkwk)
      const workers = await Worker.find();
      const workerIds = [];
      let ada = false;
      for (i = 0; i < namaWorkers.length; i++) {
        workers.map((wr) => {
          if (namaWorkers[i] === wr.nama) {
            workerIds[i] = wr.id;
            ada = true;
          }
        });
        if (ada == false) {
          errors[`worker ${i}`] = `pekerja ${namaWorkers[i]} belum terdaftar`;
        }
      }
      if (errors.length != 0) {
        throw new UserInputError(`pekerja belum terdaftar`, {
          errors,
        });
      }

      //membuat project
      const newProject = new Project({
        nama,
        alamat,
        namaCustomer,
        budget,
        startAt,
        endAt,
        progres: "0",
        namaWorkers,
        workers: workerIds,
        customer: customer.id,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      await newProject.save();
      return newProject;
    },

    async deleteProject(_, { projectId }, context) {
      const user = checkAuth(context);
      try {
        const project = await Project.findById(projectId);
        if (user.username === project.username) {
          await project.delete();
          return "data project berhasil dihapus";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    /* async updateProject(_, { projectId, input }, context) {
      const user = checkAuth(context);

      //validate input
      const { valid, errors } = validateProjectInput(input);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //update data
      const result = await Worker.findByIdAndUpdate({ _id: projectId }, input, {
        new: true,
      });
      return {
        ...result._doc,
        id: result._id,
      };
    },*/
  },
};
