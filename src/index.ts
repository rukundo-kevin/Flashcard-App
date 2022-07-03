import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

import { context } from "./context";

import { schema } from "./schema";

export const server = new ApolloServer({
  schema,
  context,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

const port = process.env.PORT || 7000;

server.listen({port}).then(({ url }) => {
    console.log(`🚀  Server is running at ${url}`);
});