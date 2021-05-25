import { expect } from "chai";
import { gql } from "graphql-request";
import jwt from "jsonwebtoken";
import { getRepository, getConnection } from "typeorm";

import { User } from "@data/db/entity/user";
import { postGraphQL } from "@test/post-graphql";

describe("Query: Users", async () => {
  afterEach(async () => {
    await getRepository(User).delete({});
  });

  const usersQuery = gql`
    query ($data: UsersInput) {
      users(data: $data) {
        count
        previusPage
        nextPage
        users {
          name
        }
      }
    }
  `;

  const usersQueryVariables = {
    data: {
      start: 0,
      limit: 2,
    },
  };

  const validToken = jwt.sign({ id: 1 }, String(process.env.JWT_SECRET), { expiresIn: "1d" });

  it("Gets users from database with correct pagination", async () => {
    const testUser = {
      name: "Leo",
      email: "leonardo.palamim@taqtile.com.br",
      password: "23er22323",
      birthDate: "31-03-1998",
    };
    const testUser2 = {
      name: "Amanda",
      email: "amanda@taqtile.com.br",
      password: "er89er89",
      birthDate: "21-11-1998",
    };
    const testUser3 = {
      name: "Yugo",
      email: "yugo@taqtile.com.br",
      password: "vf09vf09",
      birthDate: "05-03-1930",
    };

    const createdUser1 = new User();
    createdUser1.name = testUser.name;
    createdUser1.email = testUser.email;
    createdUser1.password = testUser.password;
    createdUser1.birthDate = testUser.birthDate;

    await getRepository(User).save(createdUser1);

    const createdUser2 = new User();
    createdUser2.name = testUser2.name;
    createdUser2.email = testUser2.email;
    createdUser2.password = testUser2.password;
    createdUser2.birthDate = testUser2.birthDate;

    await getRepository(User).save(createdUser2);

    const createdUser3 = new User();
    createdUser3.name = testUser3.name;
    createdUser3.email = testUser3.email;
    createdUser3.password = testUser3.password;
    createdUser3.birthDate = testUser3.birthDate;

    await getRepository(User).save(createdUser3);

    const res = await postGraphQL(usersQuery, usersQueryVariables, validToken).expect({
      data: {
        users: {
          count: 3,
          previusPage: false,
          nextPage: true,
          users: [
            {
              name: "Amanda",
            },
            {
              name: "Leo",
            },
          ],
        },
      },
    });
    expect(res.body.data.users.count).to.be.eq(3);
    expect(res.body.data.users.previusPage).to.be.eq(false);
    expect(res.body.data.users.nextPage).to.be.eq(true);
    expect(res.body.data.users.users[0].name).to.be.eq("Amanda");
  });

  it("Does not find users in database", async () => {
    const res = await postGraphQL(usersQuery, usersQueryVariables, validToken);
    expect(res.body.data.users.count).to.be.eq(0);
  });
});
