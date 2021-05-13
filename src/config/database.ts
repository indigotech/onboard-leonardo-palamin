import { createConnection } from "typeorm";
import { User } from "../api";
import dotenv from "dotenv";

dotenv.config({ path: process.env.TEST_RUNNING === "TRUE" ? "./.test.env" : "./.env" });

interface DatabaseProps {
  username: string | undefined;
  password: string | undefined;
  databaseName: string | undefined;
  port: number | undefined;
}

const databaseProps: DatabaseProps = {
  port: process.env.DATABASE_PORT as number | undefined,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  databaseName: process.env.DATABASE_NAME,
};

export class Database {
  static async config(): Promise<void> {
    await createConnection({
      type: "postgres",
      host: "localhost",
      port: databaseProps.port,
      username: databaseProps.username,
      password: databaseProps.password,
      database: databaseProps.databaseName,
      entities: [User],
      synchronize: true,
    });
    console.log(process.env.DATABASE_CONNECTED_MESSAGE);
  }
}
