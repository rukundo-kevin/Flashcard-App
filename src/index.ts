import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { context } from "./context";   

import { schema } from "./schema";
export const server = new ApolloServer({
    schema,
    context,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const port = 4000;

server.listen({port}).then(({ url }) => {
    console.log(`🚀  Server is running at ${url}`);
});