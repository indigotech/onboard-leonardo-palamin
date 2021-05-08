import { getRepository } from "typeorm";
import { User } from "../api/user";

export const validateEmail = async (email: string) => {
  const repository = getRepository(User);

  const emailAlreadyBeingUsed = await repository.findOne({ email });
  if (emailAlreadyBeingUsed) {
    throw "Este endereço de email já está sendo usado. Por favor, utilize outro.";
  }
};
