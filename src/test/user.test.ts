import { expect } from "chai";
import { postGraphQL } from "./post-graphql";
import { gql } from "graphql-request";
import jwt from "jsonwebtoken";
import { idForTest } from "./create-user.test";

describe("Query: User", () => {
  const userQuery = gql`
    query User ($user: UserInput!) {
      user(user: $user) {
        id
        name
        email
        birthDate
      }
    }
  `;
  const validToken = jwt.sign({ id: idForTest }, String(process.env.JWT_SECRET), { expiresIn: "1d" });

  it("Gets user from database", async () => {
    const userQueryVariables = {
      user: {
        id: idForTest
      },
    };
    const res = await postGraphQL(userQuery, userQueryVariables, validToken);
    expect(res.body.data.user.id).to.be.eq(String(idForTest));
  });

  it("Does not find user in database", async () => {
    const userQueryVariables = {
      user: {
        id: 3333
      },
    };
    const res = await postGraphQL(userQuery, userQueryVariables, validToken);
    expect(res.body.errors[0].message).to.be.eq("Usuário não encontrado.");
  });
});
