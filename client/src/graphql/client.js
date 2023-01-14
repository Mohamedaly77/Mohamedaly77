import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient as createWSclient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';

const httpLink = new HttpLink({
  uri: 'http://localhost:9000/graphql',
});

function isSubscribtion({ query }) {
  const definition = new getMainDefinition(query);
  return (
    definition.Kind === Kind.OPERATION_DEFINITION &&
    definition.operation === OperationTypeNode.SUBSCRIPTION
  );
}

const wsLink = new GraphQLWsLink(
  createWSclient({
    url: 'ws://localhost:9000/graphql',
  })
);

export const client = new ApolloClient({
  link: split(isSubscribtion, wsLink, httpLink),
  cache: new InMemoryCache(),
});

export default client;
