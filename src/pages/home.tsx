import { useState } from 'react';
import { Container, Heading, Stack, Text, Button, Box } from '@chakra-ui/react';
import { LoginModal } from '../components/login';
import { SignupModal } from '../components/signup';

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  return (
    <Box bg='gray.900' minH='100vh' color='white'>
      <Container maxW={'5xl'}>
        <Stack textAlign={'center'} align={'center'} py={20}>
          <Heading
            as={'span'}
            color={'purple.500'}
            size={'2xl'}
            fontWeight={800}
          >
            Cloud Containers
          </Heading>
          <Text
            fontWeight={600}
            lineHeight={'110%'}
            marginTop={10}
            fontSize='xx-large'
          >
            Deploying Containers <Text as={'span'}>made easy</Text>
          </Text>
          <Text color={'gray.400'} maxW={'3xl'}>
            The easiest way to deploy your containerized applications with
            confidence, at scale. You bring the code, we bring the rest. No
            matter the language, framework, or packaging system, we make it
            work.
          </Text>
          {isLoginModalOpen && (
            <LoginModal
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
            />
          )}
          {isSignupModalOpen && (
            <SignupModal
              isOpen={isSignupModalOpen}
              onClose={() => setIsSignupModalOpen(false)}
            />
          )}
          <Stack spacing={6} direction={'row'} marginTop={5}>
            <Button
              px={6}
              size={'lg'}
              colorScheme={'purple'}
              bg={'purple.400'}
              onClick={() => setIsLoginModalOpen(true)}
              _hover={{ bg: 'purple.500' }}
            >
              Login
            </Button>
            <Button
              px={6}
              size={'lg'}
              onClick={() => setIsSignupModalOpen(true)}
            >
              Signup
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
