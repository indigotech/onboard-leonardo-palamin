import { expect } from "chai";
import request from "supertest";
import crypto from "crypto";
import { getRepository } from "typeorm";
import { User } from "../api";
import { Database } from "../config/database";
import dotenv from "dotenv";

dotenv.config({ path: process.env.TEST_RUNNING === "TRUE" ? "./.test.env" : "./.env" });

describe("Receive Hello, Onboard!", () => {
  it("responds with Hello, Onboard!", async () => {
    const supertest = request("http://localhost:" + process.env.PORT);
    const res = await supertest.post("/graphql").send({ query: "{ helloWorld }" }).set("Accept", "application/json");
    expect(res.body.data.helloWorld).to.be.eq("Hello, onboard!");
  });
});


const TestDatabaseVars = {
  port: Number(process.env.DATABASE_PORT),
  username: String(process.env.DATABASE_USERNAME),
  password: String(process.env.DATABASE_PASSWORD),
  databaseName: String(process.env.DATABASE_NAME),
};

// Mutation data
const mutation = `
  mutation($user: UserInput!) {
    createUser(user: $user) {
      id
      name
      email
      birthDate
    }
  }
  `;

const createUserName = String("Leo");
const createUserEmail = String("leonardo.palamim@taqtile.com.br");
const createUserPassword = String("23er23er");
const createUserBirthDate = String("31-03-1998");

const variables = {
  name: createUserName,
  email: createUserEmail,
  password: createUserPassword,
  birthDate: createUserBirthDate,
};

describe("Create user", () => {
  before(async () => {
    await Database.config(TestDatabaseVars);
  });
  it("creates user", async () => {
    const supertest = request("http://localhost:4000");
    const res = await supertest
      .post("/graphql")
      .send({ query: mutation, variables: { user: variables } })
      .set("Accept", "application/json");
    expect(Number(res.body.data.createUser.id)).to.be.above(0);
    expect(res.body.data.createUser.name).to.be.eq(createUserName);
    expect(res.body.data.createUser.email).to.be.eq(createUserEmail);
    expect(res.body.data.createUser.birthDate).to.be.eq(createUserBirthDate);

    const encryptedPassword = crypto.createHash("sha256").update(createUserPassword).digest("hex");
    const createdUser = await getRepository(User).findOne(Number(res.body.data.createUser.id));
    expect(createdUser?.password).to.be.eq(encryptedPassword);
  });
});
