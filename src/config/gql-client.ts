import { Client, cacheExchange, fetchExchange } from 'urql';

const getHostname = () => {
  let hostname = window.location.hostname.split('.');
  if (hostname.length > 2) {
    hostname = hostname.slice(-2);
  }
  return hostname.join('.');
};
export const gql_client = new Client({
  url: import.meta.env.VITE_GQL_API_URL as string,
  exchanges: [cacheExchange, fetchExchange],
  requestPolicy: 'network-only',
  fetchOptions: {
    credentials: 'include',
    headers: {
      'x-api-url': getHostname(),
    },
  },
});
