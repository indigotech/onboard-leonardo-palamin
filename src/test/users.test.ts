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
    address: [],
  });
  const testUser2 = Object.assign(new User(), {
    name: "Amanda",
    email: "amanda@taqtile.com.br",
    password: "er89er89",
    birthDate: "21-11-1998",
    address: [],
  });
  const testUser3 = Object.assign(new User(), {
    name: "Yugo",
    email: "yugo@taqtile.com.br",
    password: "vf09vf09",
    birthDate: "05-03-1930",
    address: [],
  });

  it("Gets users from database with correct pagination", async () => {
    const usersQueryVariables = {
      data: {
        start: 0,
        limit: 3,
      },
    };

    await getRepository(User).save([testUser, testUser2, testUser3]);

    const adress1 = new Address();
    (adress1.cep = "90354765"),
      (adress1.street = "Av. Doutor Arnaldo"),
      (adress1.streetNumber = 2194),
      (adress1.complement = "Taqtile"),
      (adress1.neighborhood = "Sumaré"),
      (adress1.city = "São Paulo"),
      (adress1.state = "SP"),
      (adress1.userId = testUser.id);

    await getRepository(Address).save(adress1);

    const adress2 = new Address();
    (adress2.cep = "90354730"),
      (adress2.street = "Av. Doutor Arnaldo"),
      (adress2.streetNumber = 2194),
      (adress2.complement = "Taqtile"),
      (adress2.neighborhood = "Sumaré"),
      (adress2.city = "São Paulo"),
      (adress2.state = "SP"),
      (adress2.userId = testUser2.id);

    await getRepository(Address).save(adress2);

    const updatedUser1 = await getRepository(User).findOne({ id: testUser.id }, { relations: ["address"] });
    const updatedUser2 = await getRepository(User).findOne({ id: testUser2.id }, { relations: ["address"] });

    const res = await postGraphQL(usersQuery, usersQueryVariables, validToken);

    expect(res.body.data.users.users[0].id).to.be.eq(String(testUser2.id));
    expect(res.body.data.users.users[0].name).to.be.eq("Amanda");
    expect(res.body.data.users.users[0].email).to.be.eq("amanda@taqtile.com.br");
    expect(res.body.data.users.users[0].birthDate).to.be.eq("21-11-1998");

    expect(updatedUser1.address[0]).to.be.deep.eq({
      cep: "90354765",
      city: "São Paulo",
      complement: "Taqtile",
      id: updatedUser1.address[0].id,
      neighborhood: "Sumaré",
      state: "SP",
      street: "Av. Doutor Arnaldo",
      streetNumber: 2194,
    });

    expect(res.body.data.users.users[1].id).to.be.eq(String(testUser.id));
    expect(res.body.data.users.users[1].name).to.be.eq("Leo");
    expect(res.body.data.users.users[1].email).to.be.eq("leonardo.palamim@taqtile.com.br");
    expect(res.body.data.users.users[1].birthDate).to.be.eq("31-03-1998");

    expect(updatedUser2.address[0]).to.be.deep.eq({
      cep: "90354730",
      city: "São Paulo",
      complement: "Taqtile",
      id: updatedUser2.address[0].id,
      neighborhood: "Sumaré",
      state: "SP",
      street: "Av. Doutor Arnaldo",
      streetNumber: 2194,
    });

    expect(res.body.data.users.users[2].id).to.be.eq(String(testUser3.id));
    expect(res.body.data.users.users[2].name).to.be.eq("Yugo");
    expect(res.body.data.users.users[2].email).to.be.eq("yugo@taqtile.com.br");
    expect(res.body.data.users.users[2].birthDate).to.be.eq("05-03-1930");
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
