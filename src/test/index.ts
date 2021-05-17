import { Database } from "../config/database";
import { expect } from "chai";
import dotenv from "dotenv";
import request from "supertest";

dotenv.config({ path: process.env.TEST_RUNNING === "TRUE" ? "./.test.env" : "./.env" });

describe("Receive Hello, Onboard!", () => {
  it("responds with json", async () => {
    const supertest = request("http://localhost:" + process.env.PORT);
    const res = await supertest.post("/graphql").send({ query: "{ helloWorld }" }).set("Accept", "application/json");
    expect(res.body.data.helloWorld).to.be.eq("Hello, onboard!");
  });
});
