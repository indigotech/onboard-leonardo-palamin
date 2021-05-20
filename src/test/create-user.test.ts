import { expect } from "chai";
import crypto from "crypto";
import { getRepository } from "typeorm";
import { User } from "../data/db/entity/user";
import { postGraphQL } from "./post-graphql";
import { gql } from "graphql-request";
import jwt from "jsonwebtoken";

export const idForTest = 1;

describe("Mutation: createUser", () => {
  afterEach(async () => {
    await getRepository(User).delete({});
  });

  const createUserMutation = gql`
    mutation ($user: CreateUserInput!) {
      createUser(user: $user) {
        id
        name
        email
        birthDate
      }
    }
  `;
  const validToken = jwt.sign({ id: idForTest }, String(process.env.JWT_SECRET), { expiresIn: "1d" });

  it("Says user is not logged in", async () => {
    const jwt = "";
    const createUserMutationVariables = {
      user: {
        name: "Leo",
        email: "leonardo.palamim@taqtile.com.br",
        password: "23er23er",
        birthDate: "31-03-1998",
      },
    };
    const res = await postGraphQL(createUserMutation, createUserMutationVariables, jwt);
    expect(res.body.errors[0].message).to.be.eq("Usuário não está logado");
  });

  it("Says token is invalid", async () => {
    const jwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNjIxMzE0ODU5LCJleHAiOjE2MjE0MDEyNTl9.q47RT71vhrt51qvYtjSBVf-o2Qjh27x6n2QmoiwjR";
    const createUserMutationVariables = {
      user: {
        name: "Leo",
        email: "leonardo.palamim@taqtile.com.br",
        password: "23er23er",
        birthDate: "31-03-1998",
      },
    };
    const res = await postGraphQL(createUserMutation, createUserMutationVariables, jwt);
    expect(res.body.errors[0].message).to.be.eq("Token inválido.");
  });

  it("Creates user in database", async () => {
    const createUserMutationVariables = {
      user: {
        name: "Leo",
        email: "leonardo.palamim@taqtile.com.br",
        password: "23er23er",
        birthDate: "31-03-1998",
      },
    };

    const res = await postGraphQL(createUserMutation, createUserMutationVariables, validToken);
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

  it("Prevents repeated email creation", async () => {
    const repeatedEmailVars = {
      user: {
        name: "Double Leo",
        email: "leonardo.palamim@taqtile.com.br",
        password: "23er22323",
        birthDate: "31-03-1998",
      },
    };
    await postGraphQL(createUserMutation, repeatedEmailVars, validToken);
    const res = await postGraphQL(createUserMutation, repeatedEmailVars, validToken);
    expect(res.body.errors[0].message).to.be.eq(
      "Este endereço de email já está sendo usado. Por favor, utilize outro."
    );
    expect(res.body.errors[0].code).to.be.eq(409);
  });

  it("Prevents wrong password", async () => {
    const wrongPasswordVars = {
      user: {
        name: "Jonas",
        email: "jonas@taqtile.com.br",
        password: "23e",
        birthDate: "31-02-1001",
      },
    };
    const res = await postGraphQL(createUserMutation, wrongPasswordVars, validToken);
    expect(res.body.errors[0].message).to.be.eq(
      "Ops! Sua senha deve ter no mínimo 7 caracteres, com pelo menos 1 letra e 1 número. Por favor, tente novamente."
    );
    expect(res.body.errors[0].code).to.be.eq(409);
  });
});
