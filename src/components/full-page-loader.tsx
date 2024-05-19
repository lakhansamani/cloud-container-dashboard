import { Center, Spinner } from '@chakra-ui/react';

export const FullPageLoader = () => {
  return (
    <Center h='100vh'>
      <Spinner size='xl' />
    </Center>
  );
};
