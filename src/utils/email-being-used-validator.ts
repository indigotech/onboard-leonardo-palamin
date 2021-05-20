import { getRepository } from "typeorm";
import { User } from "@data/db/entity/user";
import { AuthError } from "@utils/error-handling";

export const validateEmail = async (email: string) => {
  const repository = getRepository(User);

  const emailAlreadyBeingUsed = await repository.findOne({ email });
  if (emailAlreadyBeingUsed) {
    throw new AuthError("Este endereço de email já está sendo usado. Por favor, utilize outro.");
  }
};
