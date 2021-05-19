import { createConnection } from "typeorm";
import { User } from "../entity/user";
import dotenv from "dotenv";

dotenv.config({ path: process.env.TEST_RUNNING === "TRUE" ? "./.test.env" : "./.env" });

export class Database {
  static async config(): Promise<void> {
    await createConnection({
      type: "postgres",
      host: process.env.DATBASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User],
      synchronize: true,
    });
    console.log(process.env.DATABASE_CONNECTED_MESSAGE);
  }
}
