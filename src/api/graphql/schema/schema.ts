import "graphql-import-node";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";

import * as typeDefs from "@api/graphql/schema/schema.graphql";
import resolvers from "@api/graphql/resolver-map";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export default schema;
