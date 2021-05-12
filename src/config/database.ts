import { createConnection } from "typeorm";
import { User } from "../api";

interface DatabaseProps {
  username: string
  password: string
  databaseName: string
  port: number
}

export class Database {
  static async config({ port, username, password, databaseName }: DatabaseProps): Promise<void> {
    await createConnection({
      type: "postgres",
      host: "localhost",
      port: Number(port),
      username: username,
      password: password,
      database: databaseName,
      entities: [User],
      synchronize: true,
    });
  }
}
