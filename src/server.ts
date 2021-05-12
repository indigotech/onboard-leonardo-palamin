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

dotenv.config({ path: process.env.TEST === "OK" ? "../.test.env" : "../.env" });

const DatabaseProps = {
  port: Number(process.env.DATABASE_PORT),
  username: String(process.env.DATABASE_USERNAME),
  password: String(process.env.DATABASE_PASSWORD),
  databaseName: String(process.env.DATABASE_NAME),
}

Database.config(DatabaseProps)

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
