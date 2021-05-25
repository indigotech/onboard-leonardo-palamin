import { expect } from "chai";
import { gql } from "graphql-request";
import jwt from "jsonwebtoken";
import { getRepository, getConnection } from "typeorm";

import { User } from "@data/db/entity/user";
import { postGraphQL } from "@test/post-graphql";
import { Address } from "@data/db/entity/address";

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
          id
          name
          email
          birthDate
          address {
            id
            cep
            street
            streetNumber
            complement
            neighborhood
            city
            state
            userId
          }
        }
      }
    }
  `;

  const validToken = jwt.sign({ id: 1 }, String(process.env.JWT_SECRET), { expiresIn: "1d" });

  const testUser = Object.assign(new User(), {
    name: "Leo",
    email: "leonardo.palamim@taqtile.com.br",
    password: "23er22323",
    birthDate: "31-03-1998",
    address: []
  });
  const testUser2 = Object.assign(new User(), {
    name: "Amanda",
    email: "amanda@taqtile.com.br",
    password: "er89er89",
    birthDate: "21-11-1998",
    address: []
  });
  const testUser3 = Object.assign(new User(), {
    name: "Yugo",
    email: "yugo@taqtile.com.br",
    password: "vf09vf09",
    birthDate: "05-03-1930",
    address: []
  });

  it("Gets users from database with correct pagination", async () => {
    const usersQueryVariables = {
      data: {
        start: 0,
        limit: 3,
      },
    };

    await getRepository(User).save([testUser, testUser2, testUser3]);

    const res = await postGraphQL(usersQuery, usersQueryVariables, validToken);
    expect(res.body.data.users.count).to.be.eq(3);
    expect(res.body.data.users.previusPage).to.be.eq(false);
    expect(res.body.data.users.nextPage).to.be.eq(false);

    expect(res.body.data.users.users[0]).to.be.deep.eq({
      id: String(testUser2.id),
      name: "Amanda",
      email: "amanda@taqtile.com.br",
      birthDate: "21-11-1998",
    });

    expect(res.body.data.users.users[1]).to.be.deep.eq({
      id: String(testUser.id),
      name: "Leo",
      email: "leonardo.palamim@taqtile.com.br",
      birthDate: "31-03-1998",
    });

    expect(res.body.data.users.users[2]).to.be.deep.eq({
      id: String(testUser3.id),
      name: "Yugo",
      email: "yugo@taqtile.com.br",
      birthDate: "05-03-1930",
    });
  });

  it("Gets correct pagination: case 1", async () => {
    await getRepository(User).save([testUser, testUser2, testUser3]);

    const usersQueryVariables = {
      data: {
        start: 0,
        limit: 2,
      },
    };
    const res = await postGraphQL(usersQuery, usersQueryVariables, validToken);
    expect(res.body.data.users.count).to.be.eq(3);
    expect(res.body.data.users.previusPage).to.be.eq(false);
    expect(res.body.data.users.nextPage).to.be.eq(true);
  });

  it("Gets correct pagination: case 2", async () => {
    await getRepository(User).save([testUser, testUser2, testUser3]);

    const usersQueryVariables = {
      data: {
        start: 2,
        limit: 2,
      },
    };
    const res = await postGraphQL(usersQuery, usersQueryVariables, validToken);
    expect(res.body.data.users.count).to.be.eq(3);
    expect(res.body.data.users.previusPage).to.be.eq(true);
    expect(res.body.data.users.nextPage).to.be.eq(false);
  });

  it("Gets correct pagination: case 3", async () => {
    await getRepository(User).save([testUser, testUser2, testUser3]);

    const usersQueryVariables = {
      data: {
        start: 1,
        limit: 1,
      },
    };
    const res = await postGraphQL(usersQuery, usersQueryVariables, validToken);
    expect(res.body.data.users.count).to.be.eq(3);
    expect(res.body.data.users.previusPage).to.be.eq(true);
    expect(res.body.data.users.nextPage).to.be.eq(true);
  });

  it("Returns null for bigger start args", async () => {
    await getRepository(User).save([testUser, testUser2, testUser3]);

    const usersQueryVariables = {
      data: {
        start: 20,
        limit: 1,
      },
    };
    const res = await postGraphQL(usersQuery, usersQueryVariables, validToken);
    expect(res.body.data.users.users[0]).to.be.eq(undefined);
  });

  it("Does not find users in database", async () => {
    const usersQueryVariables = {
      data: {
        start: 0,
        limit: 3,
      },
    };

    const res = await postGraphQL(usersQuery, usersQueryVariables, validToken);
    expect(res.body.data.users.count).to.be.eq(0);
  });
});
