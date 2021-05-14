import { getRepository } from "typeorm";
import { User } from "./user";
import crypto from "crypto";
import { AuthError, NotFoundError } from "../utils/error-handling";
import { validatePassword } from "../utils/password-validator";

export const loginCheck = async (email: string, password: string) => {
  const repository = getRepository(User);

  const user = await repository.findOne({ email });

  if (!user) {
    throw new NotFoundError(
      "Endereço de email não possui conta. Por favor, crie uma conta, caso não tenha com outro endereço."
    );
  }

  validatePassword(password);

  const userPassword = user?.password;
  const encryptedPassword = crypto.createHash("sha256").update(password).digest("hex");
  const correctPassword = userPassword === encryptedPassword;

  if (!correctPassword) {
    throw new AuthError("A senha digitada está errada. Por favor, tente novamente");
  }

  const token = "";

  return { user, token };
};
