import { IResolvers } from "graphql-tools";
import { User } from "./api/user";
import { getRepository } from "typeorm";
import { validatePassword } from "./utils/password-validator";
import { validateEmail } from "./utils/email-being-used-validator";
import crypto from "crypto";
import { UserInput, LoginInput } from "./schema/types";

const resolverMap: IResolvers = {
  Query: {
    helloWorld(_: void): string {
      return `Hello, onboard!`;
    },
  },
  Mutation: {
    createUser: async (_parent: any, { user: args }: { user: UserInput }) => {
      const user = new User();
      user.name = args.name;
      user.email = args.email;
      user.password = args.password;
      user.birthDate = args.birthDate;

      const passwordIsCorrect = validatePassword(args.password);
      const emailIsNotBeingUsed = await validateEmail(args.email);
      const areCredentialsCorrect = passwordIsCorrect !== null && emailIsNotBeingUsed !== null;

      const encryptedPassword = crypto.createHash("sha256").update(args.password).digest("hex");

      user.password = encryptedPassword;

      const newUser = areCredentialsCorrect ? await getRepository(User).save(user) : null;
      return newUser;
    },
    login: async (_parent: any, { data: args }: { data: LoginInput }) => {
      const user = {
        id: 10,
        name: "Leo",
        email: args.email,
        birthDate: "31-03-1998"
      };
      const token = "the_token";
      return { user, token }
    },
  },
};
export default resolverMap;
