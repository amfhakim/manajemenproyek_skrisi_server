const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const { MONGODB } = require("./config.js");
const typeDefs = require("./graphql/TypeDefs");
const resolvers = require("./graphql/resolvers");
const {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} = require("apollo-server-core");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    // Install a landing page plugin based on NODE_ENV
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageLocalDefault({
          graphRef: "my-graph-id@my-graph-variant",
          footer: false,
        })
      : ApolloServerPluginLandingPageProductionDefault({ footer: false }),
  ],
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("mongodb connected");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`server running at ${res.url}`);
  });
