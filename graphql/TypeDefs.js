const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    password: String!
    email: String
    name: String
    createdAt: String
  }
  type Query {
    Hello: String!
    getUsers: [User!]
  }
`;
