import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const httpBaseUrl = 'https://marcopeg-hasura.herokuapp.com';
const wsBaseUrl = 'ws://marcopeg-hasura.herokuapp.com';

export const createApolloClient = (token) => {
  const headers = {
    authorization: token ? `Bearer ${token}` : '',
  };

  const cache = new InMemoryCache();

  // Create an http link:
  const httpLink = new HttpLink({
    uri: `${httpBaseUrl}/v1/graphql`,
    headers,
  });

  // Create a WebSocket link:
  const wsLink = new WebSocketLink({
    uri: `${wsBaseUrl}/v1/graphql`,
    options: {
      reconnect: true,
      connectionParams: { headers }
    }
  });

  // split links based on operation type
  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  return new ApolloClient({ link, cache });
};
