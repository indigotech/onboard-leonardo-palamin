export const passwordValidate = (password: string) => {
  if (password.length < 7 || password.search(/[a-zA-Z]/) === -1 || password.search(/\d/) === -1) {
    return false;
  }
  return true;
};
