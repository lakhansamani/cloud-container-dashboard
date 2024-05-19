import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { useMutation } from 'urql';
import { CREATE_DEPLOYMENT } from '../grqphql/deployment';

interface AddDeploymentProps {
  refetch: (isMounted?: boolean, hasLoader?: boolean) => Promise<void>;
}

export const AddDeployment: FC<AddDeploymentProps> = ({ refetch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nameInput, setNameInput] = useState({
    value: '',
    error: '',
  });
  const [imageInput, setImageInput] = useState({
    value: '',
    error: '',
  });
  const [envVarsInput, setEnvVarsInput] = useState({
    value: '',
    error: '',
  });
  const [createDeplReq, createDeplMutation] = useMutation(CREATE_DEPLOYMENT);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameInput.value) {
      setNameInput({ ...nameInput, error: 'Name is required' });
      return;
    }
    if (!imageInput.value) {
      setImageInput({ ...imageInput, error: 'Image is required' });
      return;
    }
    let envVarsObj = {};
    if (envVarsInput.value) {
      const envVars = envVarsInput.value.split('\n');
      envVarsObj = envVars.reduce((acc: Record<string, string>, envVar) => {
        const [key, value] = envVar.split('=');
        acc[key] = value;
        return acc;
      }, {});
    }
    const deployment: {
      name: string;
      image: string;
      env_vars?: Record<string, string>;
    } = {
      name: nameInput.value,
      image: imageInput.value,
    };
    if (Object.keys(envVarsObj).length) {
      deployment.env_vars = envVarsObj;
    }
    await createDeplMutation({ params: deployment });
    refetch(true, true);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        colorScheme={'purple'}
        bg={'purple.400'}
        _hover={{ bg: 'purple.500' }}
        onClick={() => setIsOpen(true)}
      >
        New Deployment
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Deployment</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl
                mb={5}
                isRequired
                isInvalid={Boolean(nameInput.error)}
              >
                <FormLabel>Name</FormLabel>
                <Input
                  onChange={(e) =>
                    setNameInput({ value: e.target.value, error: '' })
                  }
                />
              </FormControl>
              <FormControl
                mb={5}
                isRequired
                isInvalid={Boolean(imageInput.error)}
              >
                <FormLabel>Image</FormLabel>
                <Input
                  onChange={(e) =>
                    setImageInput({ value: e.target.value, error: '' })
                  }
                />
              </FormControl>
              <FormControl mb={5} isInvalid={Boolean(envVarsInput.error)}>
                <FormLabel>Env Vars</FormLabel>
                <Textarea
                  placeholder='key=value'
                  onChange={(e) => {
                    setEnvVarsInput({ value: e.target.value, error: '' });
                  }}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                type='submit'
                colorScheme={'purple'}
                bg={'purple.400'}
                _hover={{ bg: 'purple.500' }}
                disabled={createDeplReq.fetching}
              >
                {createDeplReq.fetching ? 'Creating...' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
