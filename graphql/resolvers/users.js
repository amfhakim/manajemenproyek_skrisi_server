const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const checkAuth = require("../../utils/check-auth");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
const { Error } = require("mongoose");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find().sort({ createdAt: -1 });
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getUser(_, { userId }) {
      try {
        const user = await User.findById(userId);
        console.log(user);
        if (user) {
          return user;
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });
      if (!valid) {
        throw new UserInputError("error", { errors });
      }
      if (!user) {
        errors.general = "user not found";
        throw new UserInputError("user not found", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "wrong credentials";
        throw new UserInputError("wrong credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async updateUser(
      _,
      { userId, input: { username, email, password, confirmPassword, name } },
      context
    ) {
      const user = checkAuth(context);

      // make sure user doesnt already exist
      let usernameCheck = false;
      if (username) {
        const userTarget = await User.findById(userId);
        const userCheck = await User.findOne({
          username: { $regex: username, $options: "i" },
        });
        if (userCheck && userCheck.username !== userTarget.username) {
          usernameCheck = true;
        }
      }

      //validate input
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
        name,
        usernameCheck
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // hash password and create
      password = await bcrypt.hash(password, 12);

      //update data
      const update = {
        username: username,
        email: email,
        password: password,
        name: name,
      };
      const result = await User.findByIdAndUpdate({ _id: userId }, update, {
        new: true,
      });
      return {
        ...result._doc,
        id: result._id,
      };
    },

    async register(
      _,
      { input: { username, email, password, confirmPassword, name } },
      context
    ) {
      const user = checkAuth(context);
      // make sure user doesnt already exist
      let usernameCheck = false;
      if (username) {
        const userCheck = await User.findOne({ username });
        if (userCheck) {
          usernameCheck = true;
        }
      }

      // validate input data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
        name,
        usernameCheck
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // hash password and create
      password = await bcrypt.hash(password, 12);

      //create new user
      const newUser = new User({
        email,
        username,
        password,
        name,
        createdAt: new Date().toISOString(),
      });
      const result = await newUser.save();
      return {
        ...result._doc,
        id: result._id,
      };
    },

    async deleteUser(_, { userId }) {
      try {
        const user = await User.findById(userId);
        await user.delete();
        return "user deleted succesfully";
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  User: {
    //query manager
  },
};
