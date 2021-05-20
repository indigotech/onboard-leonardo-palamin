import { expect } from "chai";
import { gql } from "graphql-request";

import { postGraphQL } from "@test/post-graphql";

describe("Query: helloWorld", () => {
  it("Query 'hello' responds with Hello, Onboard!", async () => {
    const helloQuery = gql`
      {
        helloWorld
      }
    `;
    const res = await postGraphQL(helloQuery);
    expect(res.body.data.helloWorld).to.be.eq("Hello, onboard!");
  });
});
