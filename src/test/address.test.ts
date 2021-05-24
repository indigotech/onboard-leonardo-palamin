import { expect } from "chai";
import { getRepository } from "typeorm";

import { User } from "@data/db/entity/user";
import { Address } from "@data/db/entity/address";

describe("Address", () => {

  const user = {
    name: "Leo",
    email: "leo@taqtile.com.br",
    password: "32er23er",
    birthDate: "31-03-1998",
  };

  it("Creates addresses and relates to user", async () => {
    const newUser = new User();
    newUser.name = "Leo"
    newUser.email = "leo@taq.com.br"
    newUser.password = "23er23er"
    newUser.birthDate = "31-03-1998"
    newUser.address = []

    const savedUser = await getRepository(User).save(user);
    const userId = savedUser.id;

    const adress1 = new Address();
    adress1.cep = "90354765",
    adress1.street = "Av. Doutor Arnaldo",
    adress1.streetNumber = 2194,
    adress1.complement = "Taqtile",
    adress1.neighborhood = "Sumaré",
    adress1.city = "São Paulo",
    adress1.state = "SP",
    adress1.userId = userId

    const newAddress1 = await getRepository(Address).save(adress1);

    const adress2 = new Address();
    adress2.cep = "90354730",
    adress2.street = "Av. Apinajés",
    adress2.streetNumber = 24,
    adress2.complement = "Ap. 406",
    adress2.neighborhood = "Sumaré",
    adress2.city = "São Paulo",
    adress2.state = "SP",
    adress2.userId = userId

    const newAddress2 = await getRepository(Address).save(adress2);

    expect(newAddress1.userId).to.be.eq(userId);
    expect(newAddress2.userId).to.be.eq(userId);

  });
});
