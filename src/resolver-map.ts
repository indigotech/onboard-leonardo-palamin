import { IResolvers } from "graphql-tools";
import { User } from "./api/user";
import { UserResponse } from "./schema";
import { getRepository } from "typeorm";
import { passwordValidate } from "./utils/password-validator";

const resolverMap: IResolvers = {
  Query: {
    helloWorld(_: void): string {
      return `Hello, onboard!`;
    },
  },
  Mutation: {
    createUser: async (_parent: any, { user: args }: { user: UserResponse }) => {
      const user = new User();
      user.name = args.name;
      user.email = args.email;
      user.password = args.password;
      user.birthDate = args.birthDate;

      const passwordIsCorrect = passwordValidate(args.password);

      const newUser = passwordIsCorrect ? await getRepository(User).save(user) : null;
      return newUser;
    },
  },
};
export default resolverMap;
