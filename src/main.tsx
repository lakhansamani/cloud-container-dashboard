import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'urql';

import { extendTheme } from '@chakra-ui/react';

import { gql_client } from './config/gql-client.ts';
import { AuthContextProvider } from './context/auth.tsx';
import { Router } from './router.tsx';

const theme = extendTheme({
  fonts: {
    heading: `'Raleway', sans-serif`,
    body: `'Raleway', sans-serif`,
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider value={gql_client}>
        <AuthContextProvider>
          <Router />
        </AuthContextProvider>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>,
);
