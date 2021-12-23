const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    Hello: String!
    getUsers: [User!]
    getUser(userId: ID!): User!
    getCustomers: [Customer!]
    getCustomer(customerId: ID!): Customer!
    getWorkers: [Worker!]
    getWorker(workerId: ID!): Worker!
    getProjects: [Project!]
    getProject(projectId: ID!): Project!
    getPresence: [Presence!]
  }

  type Mutation {
    register(input: RegisterInput!): User!
    login(username: String!, password: String!): User!
    deleteUser(userId: ID!): String!
    updateUser(userId: ID!, input: UpdateUserInput!): User!
    createCustomer(input: CustomerInput!): Customer!
    deleteCustomer(customerId: ID!): String!
    updateCustomer(customerId: ID!, input: UpdateCustomerInput!): Customer!
    customerUpdateProjects(
      customerId: ID!
      projectIds: [ID!]
      addOrDel: Boolean!
    ): Customer!
    createWorker(input: WorkerInput!): Worker!
    deleteWorker(workerId: ID!): String!
    updateWorker(workerId: ID!, input: UpdateWorkerInput!): Worker!
    workerUpdateProjects(
      workerId: ID!
      projectIds: [ID!]
      addOrDel: Boolean!
    ): Customer!
    createProject(input: ProjectInput!): Project!
    deleteProject(projectId: ID!): String!
    updateProject(projectId: ID!, input: UpdateProjectInput!): Project!
    updateProjectWorkers(
      projectId: ID!
      input: [String!]
      addOrDel: Boolean!
    ): Project!
    createPresence(workerId: ID!, input: CreatePresenceInput!): Presence!
  }

  type User {
    id: ID!
    username: String!
    password: String!
    email: String
    name: String
    createdAt: String
    token: String
    lastLoginAt: String
  }

  type Customer {
    id: ID!
    nama: String!
    alamat: String
    notlp: String!
    email: String!
    projects: [Project]
    createdAt: String
    username: String
  }

  type Worker {
    id: ID!
    nama: String!
    alamat: String!
    notlp: String
    email: String
    jabatan: String
    gaji: String
    foto: String
    presence: [Presence]
    createdAt: String
    username: String
    projects: [Project]
  }

  type Presence {
    id: ID!
    worker: Worker!
    tanggal: String!
    kehadiran: Boolean!
    createdAt: String
    username: String
  }

  type Project {
    id: ID!
    nama: String!
    alamat: String!
    namaCustomer: String!
    budget: String
    startAt: String
    endAt: String
    progres: String
    namaWorkers: [String]
    createdAt: String
    username: String
    customer: Customer
    workers: [Worker]
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
    name: String!
  }

  input UpdateUserInput {
    username: String
    password: String
    confirmPassword: String
    email: String
    name: String
  }

  input CustomerInput {
    nama: String!
    alamat: String!
    notlp: String!
    email: String!
  }

  input WorkerInput {
    nama: String!
    alamat: String!
    notlp: String!
    email: String!
  }

  input ProjectInput {
    nama: String!
    alamat: String!
    namaCustomer: String!
    budget: String
    startAt: String
    endAt: String
    namaWorkers: [String]
  }

  input UpdateWorkerInput {
    nama: String
    alamat: String
    notlp: String
    email: String
  }

  input CreatePresenceInput {
    tanggal: String
    kehadiran: Boolean
  }

  input UpdateCustomerInput {
    nama: String
    alamat: String
    notlp: String
    email: String
  }

  input UpdateProjectInput {
    nama: String
    alamat: String
    namaCustomer: String
    budget: String
    startAt: String
    endAt: String
  }
`;
