import {
  Box,
  Container,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Center,
  Spinner,
  Tag,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { FaRegCircleUser, FaAngleDown, FaPowerOff } from 'react-icons/fa6';
import { useClient, useMutation } from 'urql';
import { useEffect, useState, useRef } from 'react';

import { useAuthContext } from '../hooks/use-auth';
import { LOGOUT } from '../grqphql/user';
import { FullPageLoader } from '../components/full-page-loader';
import { AddDeployment } from '../components/add-deployment';
import { DELETE_DEPLOYMENT, LIST_DEPLOYMENTS } from '../grqphql/deployment';
import { Deployment } from '../types/deployment';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [logoutRequest, logoutMutation] = useMutation(LOGOUT);
  const [, deleteDeploymentMutation] = useMutation(DELETE_DEPLOYMENT);
  const [currentlySelectedDeployment, setCurrentlySelectedDeployment] =
    useState<null | Deployment>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const { user, setUser } = useAuthContext();
  const client = useClient();

  async function fetchDeployment(isMounted?: boolean, hasLoader = false) {
    try {
      if (hasLoader) {
        setLoading(true);
      }
      const { data, error } = await client
        .query(LIST_DEPLOYMENTS, {})
        .toPromise();
      if (error) {
        throw error;
      }
      if (data && isMounted) {
        setDeployments([...data.deployments]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    fetchDeployment(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    // run this effect every 15 seconds
    setInterval(() => {
      fetchDeployment(isMounted);
    }, 15000);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logoutMutation();
    setUser(null);
  };

  const handleDelete = async (deployment: Deployment) => {
    setCurrentlySelectedDeployment(deployment);
    onOpen();
  };

  const onConfirmDelete = async () => {
    if (currentlySelectedDeployment) {
      await deleteDeploymentMutation({
        params: { id: currentlySelectedDeployment.id },
      });
      await fetchDeployment(true, true);
      setCurrentlySelectedDeployment(null);
      onClose();
    }
  };

  const onCancelDelete = () => {
    setCurrentlySelectedDeployment(null);
    onClose();
  };

  if (logoutRequest.fetching) {
    return <FullPageLoader />;
  }

  return (
    <Box bg='gray.900' minH='100vh' color='white'>
      <Container maxW={'5xl'}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Text color={'purple.500'} fontWeight={800} fontSize={'2xl'}>
            Cloud Containers
          </Text>
          <Menu>
            <MenuButton>
              <Flex alignItems={'center'}>
                <FaRegCircleUser />
                <Text ml={3} mr={3}>
                  {' '}
                  {user?.first_name}
                </Text>
                <FaAngleDown />
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem color={'gray.900'} onClick={handleLogout}>
                <Flex alignItems={'center'}>
                  <FaPowerOff />
                  <Text ml={3}>Logout </Text>
                </Flex>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <Box mt={20}>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text fontWeight={800} fontSize={'2xl'}>
              Your Deployments
            </Text>
            <AddDeployment refetch={fetchDeployment} />
          </Flex>
        </Box>
        {currentlySelectedDeployment && (
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onCancelDelete}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  Delete {currentlySelectedDeployment.name}
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onCancelDelete}>
                    Cancel
                  </Button>
                  <Button colorScheme='red' onClick={onConfirmDelete} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        )}
        {loading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Flex mt={5}>
            {deployments.map((deployment: Deployment) => (
              <Box
                key={deployment.id}
                p={5}
                mt={5}
                mr={5}
                width={300}
                bg='gray.800'
                borderRadius={5}
              >
                <Flex justifyContent={'space-between'} mb={10}>
                  <Text fontSize={'xl'} fontWeight={800}>
                    {deployment.name}
                  </Text>
                  <Menu>
                    <MenuButton>
                      <FaAngleDown />
                    </MenuButton>
                    <MenuList color={'gray'}>
                      <MenuItem
                        onClick={() => {
                          handleDelete(deployment);
                        }}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
                <Text>
                  <b>Image: </b>
                  {deployment.image}
                </Text>
                <Text mt={3}>
                  <b>Status: </b>
                  <Tag
                    size={'sm'}
                    colorScheme={
                      deployment.status === 'running' ||
                      deployment.status === 'exited'
                        ? 'green'
                        : 'red'
                    }
                  >
                    {deployment.status}
                  </Tag>
                </Text>
              </Box>
            ))}
          </Flex>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
