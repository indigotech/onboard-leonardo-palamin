import request from "supertest";

export const postGraphQL = (query: string | Record<string, unknown>, variables?: Record<string, unknown>) => {
  const supertest = request("http://localhost:" + process.env.PORT);
  return supertest.post("/graphql").send({ query, variables }).set("Accept", "application/json");
};
