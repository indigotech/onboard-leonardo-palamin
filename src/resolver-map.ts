import { IResolvers } from "graphql-tools";
import { User } from "./api/user";
import { UserResponse } from "./schema";
import { getRepository } from "typeorm";

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

      const newUser = await getRepository(User).save(user)
      return newUser;
    },
  },
};
export default resolverMap;
