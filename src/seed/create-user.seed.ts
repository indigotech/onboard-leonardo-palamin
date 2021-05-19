import { setupServer } from "../api/graphql/config/apollo-server";
import faker from "faker";
import { User } from "../data/db/entity/user";
import { getRepository } from "typeorm";

const CreateUserSeed = async () => {
  await setupServer();

  for (var i = 0; i < 50; i++) {
    const newUser = new User();
    newUser.name = faker.name.findName();
    newUser.email = faker.internet.email();
    newUser.password = faker.internet.password();
    newUser.birthDate = String(faker.date.past());

    await getRepository(User).save(newUser);
   
  }
};

CreateUserSeed();
