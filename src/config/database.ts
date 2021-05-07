import { createConnection } from "typeorm";
import { User } from "../api";

export class Database {
  static async config(): Promise<void> {
    await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "onboard",
      password: "onboard",
      database: "onboard",
      entities: [User],
      synchronize: true,
    });
  }
}