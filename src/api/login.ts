import { getRepository } from "typeorm";
import { User } from "./user";
import crypto from "crypto";
import { AuthError, NotFoundError } from "../utils/error-handling";
import { validatePassword } from "../utils/password-validator";

export const validateLogin = async (email: string, password: string) => {
  const repository = getRepository(User);

  const user = await repository.findOne({ email });

  if (!user) {
    throw new NotFoundError(
      "Credenciais inválidas. Por favor, tente novamente."
    );
  }

  validatePassword(password);

  const userPassword = user?.password;
  const encryptedPassword = crypto.createHash("sha256").update(password).digest("hex");
  const isPassowordCorrect = userPassword === encryptedPassword;

  if (!isPassowordCorrect) {
    throw new AuthError("A senha digitada está errada. Por favor, tente novamente");
  }

  const token = "";

  return { user, token };
};
