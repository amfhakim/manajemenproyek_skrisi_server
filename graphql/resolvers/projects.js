const Project = require("../../models/Project");
const Customer = require("../../models/Customer");
const Worker = require("../../models/Worker");
const checkAuth = require("../../utils/check-auth");
const {
  validateProjectInput,
  validateUpdateProjectInput,
} = require("../../utils/validators");
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
      if (errors.length) {
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
      customer.projects.push(newProject._id);
      await customer.save();
      return newProject;
    },

    async deleteProject(_, { projectId }, context) {
      const user = checkAuth(context);
      try {
        const project = await Project.findById(projectId);
        const customer = await Customer.findById(project.customer);
        await project.delete();

        //delete projectId in customer
        const customerProjects = customer.projects;
        let index = customerProjects.indexOf(projectId);
        if (index > -1) {
          customerProjects.splice(index, 1);
        }
        customer.projects = customerProjects;
        await customer.save();

        return "data project berhasil dihapus";
      } catch (err) {
        throw new Error(err);
      }
    },

    async updateProject(_, { projectId, input }, context) {
      const user = checkAuth(context);

      //validate input
      const { valid, errors } = validateUpdateProjectInput(input);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //update customerId in project
      const { namaCustomer } = input;
      if (namaCustomer) {
        const customer = await Customer.findOne({ nama: namaCustomer });
        if (!customer) {
          throw new UserInputError("customer belum terdaftar", {
            errors: {
              customer: "customer belum terdaftar",
            },
          });
        }
        const project = await Project.findById(projectId);
        project.customer = customer._id;
        await project.save();
        customer.projects.push(project._id);
        await customer.save();
      }

      //update project
      const result = await Project.findByIdAndUpdate(
        { _id: projectId },
        input,
        {
          new: true,
        }
      );
      return {
        ...result._doc,
        id: result._id,
      };
    },

    async updateProjectWorkers(_, { projectId, input }, context) {
      const user = checkAuth(context);
      const workers = await Worker.find();
      const workerIds = [];
      const errors = {};

      //validate workers
      let ada = false;
      for (i = 0; i < input.length; i++) {
        workers.map((wr) => {
          if (input[i] === wr.nama) {
            workerIds[i] = wr.id;
            ada = true;
          }
        });
        if (ada == false) {
          errors[`worker ${i}`] = `pekerja ${input[i]} belum terdaftar`;
        }
      }
      if (errors.length) {
        throw new UserInputError(`pekerja belum terdaftar`, {
          errors,
        });
      }

      //update project
      const valueToUpdate = {
        namaWorkers: input,
        workers: workerIds,
      };
      const project = await Project.findByIdAndUpdate(
        { _id: projectId },
        valueToUpdate,
        {
          new: true,
        }
      );
      return project;
    },
  },

  /*Project: {
    async workers(_, _, _) {},
    async costumer(_, _, _) {},
    async pekerjaans(_, _, _) {},
  }, */
};
