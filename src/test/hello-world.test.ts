import { expect } from "chai";
import { postGraphQL } from "./post-graphql";
import { gql } from "graphql-request";

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
