import { AuthError } from "./error-handling";
import jwt from "jsonwebtoken";

export const validateToken = (token: string) => {
  if (!token) {
    throw new AuthError("Usuário não está logado");
  }

  try {
    jwt.verify(token, String(process.env.JWT_SECRET));
  } catch (err) {
    if (err == "TokenExpiredError: jwt expired") {
      throw new AuthError("Token expirou! Por favor, faça o login novamente.");
    }
    if (err == "JsonWebTokenError: invalid signature") {
      throw new AuthError("Token inválido.");
    }
  }
};
