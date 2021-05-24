import { expect } from "chai";
import { gql } from "graphql-request";
import jwt from "jsonwebtoken";
import { getRepository, getConnection } from "typeorm";

import { User } from "@data/db/entity/user";
import { postGraphQL } from "@test/post-graphql";
import { Address } from "@data/db/entity/address";

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
        address {
          cep
        }
      }
    }
  `;

  const validToken = jwt.sign({ id: 1 }, String(process.env.JWT_SECRET), { expiresIn: "1d" });

  it("Gets user from database", async () => {
    const testUser = {
      name: "Leo",
      email: "leonardo.palamim@taqtile.com.br",
      password: "23er22323",
      birthDate: "31-03-1998",
    };

    const createdUser = new User();
    createdUser.name = testUser.name;
    createdUser.email = testUser.email;
    createdUser.password = testUser.password;
    createdUser.birthDate = testUser.birthDate;

    const user = await getRepository(User).save(createdUser);

    const adress1 = new Address();
    (adress1.cep = "90354765"),
      (adress1.street = "Av. Doutor Arnaldo"),
      (adress1.streetNumber = 2194),
      (adress1.complement = "Taqtile"),
      (adress1.neighborhood = "Sumaré"),
      (adress1.city = "São Paulo"),
      (adress1.state = "SP"),
      (adress1.userId = user.id);

    await getRepository(Address).save(adress1);

    const userQueryVariables = {
      user: {
        id: user.id,
      },
    };

    const res = await postGraphQL(userQuery, userQueryVariables, validToken).expect({
      data: {
        user: {
          id: String(user.id),
          name: "Leo",
          email: testUser.email,
          birthDate: testUser.birthDate,
          address: [
            {
              cep: "90354765",
            },
          ],
        },
      },
    });
    expect(res.body.data.user.id).to.be.eq(String(user.id));
    expect(res.body.data.user.name).to.be.eq("Leo");
    expect(res.body.data.user.email).to.be.eq(testUser.email);
    expect(res.body.data.user.birthDate).to.be.eq(testUser.birthDate);

    const updatedUser = getRepository(User).findOne( { id: user.id}, { relations: ["address"] } )
    expect(res.body.data.user.address[0].cep).to.be.eq((await updatedUser).address[0].cep);
  });

  it("Does not find user in database", async () => {
    const userQueryVariables = {
      user: {
        id: 3333,
      },
    };
    const res = await postGraphQL(userQuery, userQueryVariables, validToken);
    expect(res.body.data.user).to.be.eq(null);
  });
});
