import { IResolvers } from "graphql-tools";
import { User } from "./api/user";
import { UserResponse } from "./schema";
import { getRepository } from "typeorm";
import { validatePassword } from "./utils/password-validator";
import { validateEmail } from "./utils/email-validator";

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

      const passwordIsCorrect = validatePassword(args.password);
      const emailIsNotBeingUsed = await validateEmail(args.email);
      const areCredentialsCorrect = passwordIsCorrect !== null && emailIsNotBeingUsed !== null;

      const newUser = areCredentialsCorrect ? await getRepository(User).save(user) : null;
      return newUser;
    },
  },
};
export default resolverMap;
