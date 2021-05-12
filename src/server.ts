import express from "express";
import { ApolloServer } from "apollo-server-express";
import depthLimit from "graphql-depth-limit";
import { createServer } from "http";
import compression from "compression";
import cors from "cors";
import schema from "./schema";
import "reflect-metadata";
import { Database } from "./config/database";
import dotenv from "dotenv";

const Server = async () => {
  dotenv.config({ path: process.env.TEST_RUNNING === "TRUE" ? "./.test.env" : "./.env" });

  const DatabaseProps = {
    port: Number(process.env.DATABASE_PORT),
    username: String(process.env.DATABASE_USERNAME),
    password: String(process.env.DATABASE_PASSWORD),
    databaseName: String(process.env.DATABASE_NAME),
  };

  await Database.config(DatabaseProps).then((): void => console.log(process.env.DATABASE_CONNECTED_MESSAGE));

  const app = express();
  const server = new ApolloServer({
    schema,
    validationRules: [depthLimit(7)],
  });

  app.use(cors());
  app.use(compression());
  server.applyMiddleware({ app, path: "/graphql" });

  const httpServer = createServer(app);

  httpServer.listen({ port: 4000 }, (): void => console.log(process.env.SERVER_CONNECTED_MESSAGE));
};

Server();
