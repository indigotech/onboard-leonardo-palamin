import { AuthError } from "./error-handling";

export const validatePassword = (password: string) => {
  if (password.length < 7 || password.search(/[a-zA-Z]/) === -1 || password.search(/\d/) === -1) {
    throw new AuthError("Ops! Sua senha deve ter no mínimo 7 caracteres, com pelo menos 1 letra e 1 número. Por favor, tente novamente.");
  }
};
