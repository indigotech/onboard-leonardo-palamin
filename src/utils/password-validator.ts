export const passwordValidate = (password: string) => {
  if (password.length < 7 || password.search(/[a-zA-Z]/) === -1 || password.search(/\d/) === -1) {
    throw "Ops! Sua senha deve ter no mínimo 7 caracteres, com pelo menos 1 letra e 1 número. Por favor, tente novamente.";
  } else {
    return true;
  }
};
