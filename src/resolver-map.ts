import { IResolvers } from "graphql-tools";
import { User } from "./api/user";
import { getRepository } from "typeorm";
import { validatePassword } from "./utils/password-validator";
import { validateEmail } from "./utils/email-being-used-validator";
import crypto from "crypto";
import { UserInput, LoginInput } from "./schema/types";
import { validateLogin } from "./api/login";
import jwt from "jsonwebtoken";
import { AuthError } from "./utils/error-handling";
import { stringify } from "querystring";

const resolverMap: IResolvers = {
  Query: {
    helloWorld(_: void): string {
      return `Hello, onboard!`;
    },
  },
  Mutation: {
    createUser: async (_parent: any, { user: args }: { user: UserInput }, token: string) => {
      interface TokenProps {
        email: string
        iat: number
        exp: number
      }

      const isTokenValid = jwt.verify(token, "supersecret");
      if (!isTokenValid) {
        throw new AuthError("Token inválido!")
      }

      const validatedToke = isTokenValid as TokenProps

      const notExpired = validatedToke.exp > 0
      if (!notExpired) {
        throw new AuthError("Token expirado")
      }

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
