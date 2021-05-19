import { getRepository } from "typeorm";
import { User } from "../../data/db/entity/user";
import crypto from "crypto";
import { AuthError } from "../../utils/error-handling";
import { validatePassword } from "../../utils/password-validator";
import jwt from "jsonwebtoken";

export const validateLogin = async (email: string, password: string, rememberMe?: boolean) => {
  const repository = getRepository(User);

  const user = await repository.findOne({ email });

  const userId = user?.id;

  if (!user) {
    throw new AuthError("Email e/ou senha inválidos. Por favor, tente novamente.");
  }

  validatePassword(password);

  const userPassword = user?.password;
  const encryptedPassword = crypto.createHash("sha256").update(password).digest("hex");
  const isPassowordCorrect = userPassword === encryptedPassword;

  if (!isPassowordCorrect) {
    throw new AuthError("A senha digitada está errada. Por favor, tente novamente");
  }

  const tokenDuration = rememberMe ? process.env.JWT_EXPIRATION_LONG : process.env.JWT_EXPIRATION_SHORT;
  const token = jwt.sign({ id: userId }, String(process.env.JWT_SECRET), { expiresIn: tokenDuration });

  return { user, token };
};
