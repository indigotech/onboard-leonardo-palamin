import express from "express";
import { ApolloServer } from "apollo-server-express";
import depthLimit from "graphql-depth-limit";
import { createServer } from "http";
import compression from "compression";
import cors from "cors";
import schema from "./schema";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./api/user/user";

const app = express();
const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(7)],
});

app.use(cors());
app.use(compression());
server.applyMiddleware({ app, path: "/graphql" });

const httpServer = createServer(app);

httpServer.listen({ port: 4000 }, (): void =>
  console.log("Backend onboarding is now runnind on http://localhost:4000/graphql")
);

createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "onboard",
  password: "onboard",
  database: "onboard",
  entities: [User],
  synchronize: true,
  logging: false,
})
  .then((connection) => {
    let user = new User();
    user.name = "Leo";

    return connection.manager.save(user);
  })
  .catch((error) => console.log(error));
