const Customer = require("../../models/Customer");
const Project = require("../../models/Project");
const checkAuth = require("../../utils/check-auth");
const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const { validateCustomerInput } = require("../../utils/validators");

module.exports = {
  Query: {
    async getCustomers() {
      try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        return customers;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getCustomer(_, { customerId }) {
      try {
        const customer = await Customer.findById(customerId);
        if (customer) {
          return customer;
        } else {
          throw new Error("Customer not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createCustomer(_, { input }, context) {
      const user = checkAuth(context);
      const { valid, errors } = validateCustomerInput(input);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const newCustomer = new Customer({
        ...input,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const result = await newCustomer.save();
      return {
        ...result._doc,
        id: result._id,
      };
    },

    async updateCustomer(_, { customerId, input }, context) {
      const user = checkAuth(context);
      // make sure customer's name doesnt already exist
      const { nama } = input;
      let checkNama = false;
      if (nama) {
        const customerTarget = await Customer.findById(customerId);
        const customerCheck = await Customer.findOne({
          nama: { $regex: nama, $options: "i" },
        });
        if (customerCheck && customerCheck.nama !== customerTarget.nama) {
          checkNama = true;
        }
      }

      //validate input
      const { valid, errors } = validateCustomerInput(input, checkNama);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //update data
      const result = await Customer.findByIdAndUpdate(
        { _id: customerId },
        input,
        {
          new: true,
        }
      );

      //update nama in project
      if (nama) {
        await Project.updateMany(
          { customerId: customerId },
          { namaCustomer: nama }
        );
      }
      return {
        ...result._doc,
        id: result._id,
      };
    },

    async deleteCustomer(_, { customerId }, context) {
      const user = checkAuth(context);
      try {
        const customer = await Customer.findById(customerId);
        await customer.delete();
        await Project.updateMany(
          { customerId: customerId },
          { customerId: null }
        );

        return "data customer berhasil dihapus";
      } catch (err) {
        throw new Error(err);
      }
    },

    async customerUpdateProjects(
      _,
      { customerId, projectIds, addOrDel },
      context
    ) {
      const customer = await Customer.findById(customerId);
      if (addOrDel) {
        //add project ids
        customer.projectIds.push(projectIds);
        await customer.save();
        for (i = 0; i < projectIds.length; i++) {
          await Project.findByIdAndUpdate(
            { _id: projectIds[i] },
            { customerId: customerId },
            { new: true }
          );
        }
      } else {
        //delete project ids
        const customerProjects = customer.projectIds;
        for (i = 0; i < projectIds.length; i++) {
          let index = customerProjects.indexOf(projectIds[i]);
          if (index > -1) {
            customerProjects.splice(index, 1);
          }
        }
        customer.projectIds = customerProjects;
        await customer.save();
        await Project.updateMany(
          { customerId: customerId },
          { customerId: null }
        );
      }
      return customer;
    },
  },

  Customer: {
    async projects(parent, args, context) {
      const projects = await Project.find({ customerId: parent._id });
      return projects;
    },
  },
};
