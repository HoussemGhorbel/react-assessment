import React from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

import App from 'components/app'

const client = new ApolloClient({
  uri: 'https://fakerql.nplan.io/graphql',
  cache: new InMemoryCache(),
})

const Root = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

export default Root
