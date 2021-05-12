import { Database } from "../config/database";

const request = require("supertest");

describe("GET /hello", () => {
  before(async () => {
    await Database.config();
  });
  it("responds with json", async () => {
    const supertest = request("http://localhost:4000");
    await supertest
      .post("/graphql")
      .send({ query: "{ helloWorld }" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
  });
});

