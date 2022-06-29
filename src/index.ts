import { ApolloServer } from "apollo-server";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { context } from "./context";

import { schema } from "./schema";

export const server = new ApolloServer({
  schema,
  context,
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
    ApolloServerPluginLandingPageLocalDefault(),
  ],
});

const port = process.env.PORT || 3000;

server.listen({port}).then(({ url }) => {
    console.log(`🚀  Server is running at ${url}`);
});