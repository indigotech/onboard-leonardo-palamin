import 'graphql-import-node';
import * as typeDefs from './schema/schema.graphql';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolver-map';
import { GraphQLSchema } from 'graphql';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export default schema;
