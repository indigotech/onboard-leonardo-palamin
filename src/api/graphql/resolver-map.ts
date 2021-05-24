import { IResolvers } from "graphql-tools";
import { getRepository } from "typeorm";
import crypto from "crypto";

import { UserCreateInput, UserInput, UsersInput, LoginInput } from "@api/graphql/schema/types";
import { validateLogin } from "@api/graphql/login";
import { User } from "@data/db/entity/user";
import { validatePassword } from "@utils/password-validator";
import { validateEmail } from "@utils/email-being-used-validator";
import { validateToken } from "@utils/validate-token";
import { NotFoundError } from "@utils/error-handling";

const resolverMap: IResolvers = {
  Query: {
    helloWorld(_: void): string {
      return `Hello, onboard!`;
    },
    user: async (_parent: any, { user: args }: { user: UserInput }, context: any) => {
      validateToken(context.jwt);

      const user = await getRepository(User).findOne(args.id);
      if (!user) {
        throw new NotFoundError("Usuário não encontrado.");
      }
      return user;
    },
    users: async (_: any, { filter: args }: { filter: number }, context: any) => {
      validateToken(context.jwt);
      const users = await getRepository(User).find();
      if (!users || users.length === 0) {
        throw new NotFoundError("Usuários não encontrados");
      }
      users.sort((a, b) => a.name.localeCompare(b.name));
      const filteredUsers = users.slice(0, args ? args : 50);
      return filteredUsers;
    },
  },

  Mutation: {
    createUser: async (_parent: any, { user: args }: { user: UserCreateInput }, context: any) => {
      validateToken(context.jwt);

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
    login: (_parent: any, { data: args }: { data: LoginInput }) => {
      const loginResponse = validateLogin(args.email, args.password);

      return loginResponse;
    },
  },
};
export default resolverMap;
