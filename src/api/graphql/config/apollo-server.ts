import express from "express";
import { ApolloServer } from "apollo-server-express";
import depthLimit from "graphql-depth-limit";
import { createServer } from "http";
import compression from "compression";
import cors from "cors";
import "reflect-metadata";

import schema from "@api/graphql/schema/schema";
import { Database } from "@data/db/database";
import { formatError } from "@utils/error-handling";

export const setupServer = async () => {
  await Database.config();

  const app = express();
  const server = new ApolloServer({
    schema,
    validationRules: [depthLimit(7)],
    formatError,
    context: ({ req }) => ({
      jwt: req.headers.authorization,
    }),
  });

  app.use(cors());
  app.use(compression());
  server.applyMiddleware({ app, path: "/graphql" });

  const httpServer = createServer(app);

  httpServer.listen({ port: process.env.PORT }, (): void => console.log(process.env.SERVER_CONNECTED_MESSAGE));
};
