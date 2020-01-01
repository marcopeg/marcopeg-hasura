import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { useAuth } from '../auth';
import { createApolloClient } from './create-apollo-client';

const ApolloProviderWithAuth = ({ children }) => {
  const { token } = useAuth();

  return (
    <ApolloProvider client={createApolloClient(token)}>
      {children}
    </ApolloProvider>
  )
};

export default ApolloProviderWithAuth;
