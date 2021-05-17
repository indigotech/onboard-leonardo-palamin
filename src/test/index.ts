import { expect } from "chai";
import request from "supertest";
import crypto from "crypto";
import { getRepository } from "typeorm";
import { User } from "../api";
import { setupServer } from "../server";
import { postGraphQL } from "./post-graphql";
import { gql } from "graphql-request";

describe("Running tests", () => {
  before(async () => {
    await setupServer();
  });

  it("Query 'hello' responds with Hello, Onboard!", async () => {
    const helloQuery = gql`
      {
        helloWorld
      }
    `;
    const res = await postGraphQL(helloQuery);
    expect(res.body.data.helloWorld).to.be.eq("Hello, onboard!");
  });

  it("Creates user in database", async () => {
    const createUserMutation = gql`
      mutation ($user: UserInput!) {
        createUser(user: $user) {
          id
          name
          email
          birthDate
        }
      }
    `;
    const createUserMutationVariables = {
      user: {
        name: "Leo",
        email: "leonardo.palamim@taqtile.com.br",
        password: "23er23er",
        birthDate: "31-03-1998",
      },
    };

    const res = await postGraphQL(createUserMutation, createUserMutationVariables);
    expect(+res.body.data.createUser.id).to.be.above(0);
    expect(res.body.data.createUser.name).to.be.eq(createUserMutationVariables.user.name);
    expect(res.body.data.createUser.email).to.be.eq(createUserMutationVariables.user.email);
    expect(res.body.data.createUser.birthDate).to.be.eq(createUserMutationVariables.user.birthDate);

    const createdUser = await getRepository(User).findOne(+res.body.data.createUser.id);
    expect(createdUser?.name).to.be.eq(createUserMutationVariables.user.name);
    expect(createdUser?.email).to.be.eq(createUserMutationVariables.user.email);
    expect(createdUser?.birthDate).to.be.eq(createUserMutationVariables.user.birthDate);

    const encryptedPassword = crypto
      .createHash("sha256")
      .update(createUserMutationVariables.user.password)
      .digest("hex");
    expect(createdUser?.password).to.be.eq(encryptedPassword);
  });
});
