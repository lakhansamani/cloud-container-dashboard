import { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { useClient } from 'urql';

import { User } from '../types/user';
import { GET_SESSION } from '../grqphql/user';
import { FullPageLoader } from '../components/full-page-loader';

interface AuthContextData {
  loading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextData>({
  loading: true,
  user: null,
  setUser: () => {},
});

interface AuthContextProviderProps {
  children?: ReactNode;
}

export const AuthContextProvider: FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const client = useClient();
  useEffect(() => {
    let isMounted = true;
    async function fetchSession() {
      try {
        const { data, error } = await client.query(GET_SESSION, {}).toPromise();
        if (error) {
          throw error;
        }
        if (data && isMounted) {
          setUser(data.session.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, [client]);

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <AuthContext.Provider value={{ loading, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
