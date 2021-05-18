import { AuthError } from "./error-handling";
import jwt from "jsonwebtoken";

export const validateToken = (token: string) => {

  const isThereToken = token;
  if (!isThereToken) {
    throw new AuthError("Usuário não está logado");
  }

  try {
    jwt.verify(token, "supersecret");
  } catch (err) {
    if (err == "TokenExpiredError: jwt expired") {
      throw new AuthError("Token expirou! Por favor, faça o login novamente.");
    } 
    if (err == "JsonWebTokenError: invalid signature") {
      throw new AuthError("Token inválido.");
    }
  }
};
