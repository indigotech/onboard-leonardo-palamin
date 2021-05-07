import { IResolvers } from "graphql-tools";
import { User } from "./api/user";
import { UserResponse } from "./schema";
import { getRepository } from "typeorm";
import { passwordValidate } from "./utils/password-validator";
import { emailBeingUsedValidate } from "./utils/email-being-used-validator";
import crypto from "crypto";

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
      const emailIsNotBeingUsed = await emailBeingUsedValidate(args.email);
      const validatedUser = passwordIsCorrect && emailIsNotBeingUsed;

      const encryptedPassword = crypto
        .createHash("sha256")
        .update(args.password)
        .digest("hex")
      
      user.password = encryptedPassword
      
      const newUser = validatedUser ? await getRepository(User).save(user) : null
      return newUser;
    },
  },
};
export default resolverMap;
