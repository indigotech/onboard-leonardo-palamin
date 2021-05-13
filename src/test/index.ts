import { expect } from "chai";
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

  //Testing repeated email error
  it("Prevents repeated email creation", async () => {
    const repeatedEmailVars = {
      user: {
        name: "Leo Again",
        email: "leonardo.palamim@taqtile.com.br",
        password: "23er22323",
        birthDate: "31-03-1998",
      },
    };
    const res = await postGraphQL(createUserMutation, repeatedEmailVars);
    expect(res.body.errors[0].message).to.be.eq(
      "Este endereço de email já está sendo usado. Por favor, utilize outro."
    );
    expect(res.body.errors[0].code).to.be.eq(409);
  });

  //Testing wrong password error
  it("Prevents wrong password", async () => {
    const wrongPasswordVars = {
      user: {
        name: "Jonas",
        email: "jonas@taqtile.com.br",
        password: "23e",
        birthDate: "31-02-1001",
      },
    };
    const res = await postGraphQL(createUserMutation, wrongPasswordVars);
    expect(res.body.errors[0].message).to.be.eq(
      "Ops! Sua senha deve ter no mínimo 7 caracteres, com pelo menos 1 letra e 1 número. Por favor, tente novamente."
    );
    expect(res.body.errors[0].code).to.be.eq(409);
  });
});
