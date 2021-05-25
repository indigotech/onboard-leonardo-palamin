import { setupServer } from "@api/graphql/config/apollo-server";

describe("Run tests", () => {
  before(async () => {
    await setupServer();
  });

  require("./address.test");
  require("./create-user.test");
  require("./hello-world.test");
  require("./user.test");
  require("./users.test");
});
