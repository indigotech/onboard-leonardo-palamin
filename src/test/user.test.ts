import { expect } from "chai";
import { gql } from "graphql-request";
import jwt from "jsonwebtoken";
import { getRepository, getConnection } from "typeorm";

import { User } from "@data/db/entity/user";
import { postGraphQL } from "@test/post-graphql";

describe("Query: User", async () => {
  afterEach(async () => {
    await getRepository(User).delete({});
  });

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

    const testUser = {
      name: "Leo",
      email: "leonardo.palamim@taqtile.com.br",
      password: "23er22323",
      birthDate: "31-03-1998"
    }

    const createdUser = new User();
    createdUser.name = testUser.name;
    createdUser.email = testUser.email;
    createdUser.password = testUser.password;
    createdUser.birthDate = testUser.birthDate;

    const user = await getRepository(User).save(createdUser);

    const userQueryVariables = {
      user: {
        id: user?.id,
      },
    };

    const res = await postGraphQL(userQuery, userQueryVariables, validToken).expect({
      data: {
        user: {
          id: String(user.id),
          name: "Leo",
          email: testUser.email,
          birthDate: testUser.birthDate,
        },
      },
    });
    expect(res.body.data.user.id).to.be.eq(String(user.id));
    expect(res.body.data.user.name).to.be.eq("Leo");
    expect(res.body.data.user.email).to.be.eq(testUser.email);
    expect(res.body.data.user.birthDate).to.be.eq(testUser.birthDate);
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
