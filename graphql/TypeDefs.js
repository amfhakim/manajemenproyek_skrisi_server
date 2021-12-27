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
    getPresencesInWorkers(
      workerIds: [ID!]
      input: getPresenceInput
    ): [Presence!]
    getPresencesInProject(projectIds: ID!, input: getPresenceInput): [Presence!]
    getTasksInProject(projectId: ID!): [Task!]
    getMaterialsInTask(taskId: ID!): [Material!]
    getToolsInTask(taskId: ID!): [Tool!]
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
    createPresence(
      workerId: ID!
      projectId: ID!
      input: PresenceInput!
    ): Presence!
    updatePresence(
      workerId: ID!
      projectId: ID!
      input: PresenceInput!
    ): Presence!
    createTask(projectId: ID!, input: createTaskInput!): Task!
    updateTask(taskId: ID!, input: updateTaskInput!): Task!
    deleteTask(taskId: ID!): String!
    createMaterial(taskId: ID!, input: createMaterialInput!): Material!
    updateMaterial(materialId: ID!, input: updateMaterialInput!): Material!
    deleteMaterial(materialId: ID!): String!
    createTool(taskId: ID!, input: createToolInput!): Tool!
    updateTool(toolId: ID!, input: updateToolInput!): Tool!
    deleteTool(toolId: ID!): String!
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
    foto: String
    presences: [Presence]
    createdAt: String
    username: String
    projects: [Project]
  }

  type Presence {
    id: ID!
    worker: Worker!
    project: Project!
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
    startAt: String
    endAt: String
    progres: Float
    namaWorkers: [String]
    createdAt: String
    username: String
    customer: Customer
    workers: [Worker]
    presences: [Presence]
    tasks: [Task]
  }

  type Task {
    id: ID!
    nama: String!
    startAt: String!
    endAt: String!
    status: Boolean
    materials: [Material]
    tools: [Tool]
    project: Project
    createdAt: String
    username: String
  }

  type Material {
    id: ID!
    nama: String!
    jenis: String
    jumlah: Int!
    satuan: String
    status: Boolean
    task: Task
    createdAt: String
    username: String
  }

  type Tool {
    id: ID!
    nama: String!
    jumlah: Int!
    status: Boolean
    task: Task
    createdAt: String
    username: String
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

  input PresenceInput {
    tanggal: String
    kehadiran: Boolean
  }
  input getPresenceInput {
    tanggalMulai: String
    tanggalSelesai: String
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
    startAt: String
    endAt: String
  }

  input createTaskInput {
    nama: String!
    startAt: String
    endAt: String
  }
  input updateTaskInput {
    nama: String
    startAt: String
    endAt: String
    status: Boolean
  }

  input createMaterialInput {
    nama: String
    jenis: String
    jumlah: Int
    satuan: String
  }
  input updateMaterialInput {
    nama: String
    jenis: String
    jumlah: Int
    satuan: String
    status: Boolean
  }

  input createToolInput {
    nama: String
    jumlah: Int
  }
  input updateToolInput {
    nama: String
    jumlah: Int
    status: Boolean
  }
`;
