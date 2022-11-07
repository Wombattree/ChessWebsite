import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import "bulma/css/bulma.min.css";
import PageContainer from './components/PageContainer/PageContainer';

const httpLink = createHttpLink({ uri: '/graphql', });

const authLink = setContext((_, { headers }) => 
{
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() 
{
  return (
    <ApolloProvider client={client}>
      <Router>
        <PageContainer />
      </Router>
    </ApolloProvider>
  );
}