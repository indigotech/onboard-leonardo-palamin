import { setupServer } from "@api/graphql/config/apollo-server";

describe("Run tests", () => {
  before(async () => {
    await setupServer();
  });

  require("./users.test");
});
