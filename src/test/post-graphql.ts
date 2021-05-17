import { DocumentNode } from "graphql";
import request from "supertest";

export const postGraphQL = (query: string, variables?: Record<string, unknown>) => {
  const supertest = request("http://localhost:" + process.env.PORT);
  return supertest.post("/graphql").send({ query, variables }).set("Accept", "application/json");
};
