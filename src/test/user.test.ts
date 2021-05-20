import { expect } from "chai";
import { gql } from "graphql-request";
import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";

import { User } from "@data/db/entity/user";
import { postGraphQL } from "@test/post-graphql";

describe("Query: User", async () => {
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

  const userQuery = gql`
    query User($user: UserInput!) {
      user(user: $user) {
        id
        name
        email
        birthDate
      }
    }
  `;

  const validToken = jwt.sign({ id: 1 }, String(process.env.JWT_SECRET), { expiresIn: "1d" });

  it("Gets user from database", async () => {
    const variables = {
      user: {
        name: "Double Leo",
        email: "leonardo.palamim@taqtile.com.br",
        password: "23er22323",
        birthDate: "31-03-1998",
      },
    };

    const createdUser = await postGraphQL(createUserMutation, variables, validToken);
    const userId = await getRepository(User).findOne(createdUser.body.data.createUser);

    const userQueryVariables = {
      user: {
        id: userId?.id,
      },
    };
    const res = await postGraphQL(userQuery, userQueryVariables, validToken);
    expect(res.body.data.user.id).to.be.eq(String(userId?.id));
    const user = await getRepository(User).findOne(res.body.data.user.id);
    expect(res.body.data.user.name).to.be.eq(user?.name);
    expect(res.body.data.user.email).to.be.eq(user?.email);
    expect(res.body.data.user.birthDate).to.be.eq(user?.birthDate);
  });

  it("Does not find user in database", async () => {
    const userQueryVariables = {
      user: {
        id: 3333,
      },
    };
    const res = await postGraphQL(userQuery, userQueryVariables, validToken);
    expect(res.body.errors[0].message).to.be.eq("Usuário não encontrado.");
    expect(res.body.errors[0].code).to.be.eq(404);
  });
});
