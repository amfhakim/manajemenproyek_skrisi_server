const Customer = require("../../models/Customer");
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
    async createCustomer(
      _,
      { input: { nama, alamat, notlp, email } },
      context
    ) {
      const user = checkAuth(context);
      const { valid, errors } = validateCustomerInput(
        nama,
        alamat,
        notlp,
        email
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const newCustomer = new Customer({
        nama,
        alamat,
        notlp,
        email,
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
      return {
        ...result._doc,
        id: result._id,
      };
    },

    async deleteCustomer(_, { customerId }, context) {
      const user = checkAuth(context);
      try {
        const customer = await Customer.findById(customerId);
        if (user.username === customer.username) {
          await customer.delete();
          return "data customer berhasil dihapus";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
