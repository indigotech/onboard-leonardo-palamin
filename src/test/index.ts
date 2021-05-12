import { Database } from "../config/database";
import { expect } from "chai";

const request = require("supertest");

describe('Receive Hello, Onboard!', () => {
<<<<<<< HEAD
  before(async () => {
    await Database.config();
  });
  it("responds with json", async () => {
    const supertest = request("http://localhost:4000");
    const res = await supertest
      .post("/graphql")
      .send({ query: "{ helloWorld }" })
      .set("Accept", "application/json")
    expect(res.body.data.helloWorld).to.be.eq('Hello, onboard!');
=======
  it('responds with json', async () => {
    const supertest = request('http://localhost:4000');
    const response = await supertest
      .post('/graphql')
      .send({ query: '{ helloWorld }' })
      .set("Accept", "application/json");
    expect(response.body.data.helloWorld).to.be.eq('Hello, onboard!');
>>>>>>> feat: environments'
  });
});

