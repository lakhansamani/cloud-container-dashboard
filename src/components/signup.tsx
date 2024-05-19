import { FC, FormEvent, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Divider,
  HStack,
  PinInput,
  PinInputField,
  ModalFooter,
  FormErrorMessage,
  Stack,
} from '@chakra-ui/react';
import { useMutation } from 'urql';

import { SIGNUP, VERIFY_OTP } from '../grqphql/user';
import { useAuthContext } from '../hooks/use-auth';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignupModal: FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('signup');
  const [emailInput, setEmailInput] = useState({
    value: '',
    error: '',
  });
  const [firstName, setFirstName] = useState({
    value: '',
    error: '',
  });
  const [lastName, setLastName] = useState({
    value: '',
    error: '',
  });
  const [otpInput, setOtpInput] = useState({
    value: '',
    error: '',
  });
  const [signUpRequest, signUpMutation] = useMutation(SIGNUP);
  const [otpRequest, otpMutation] = useMutation(VERIFY_OTP);
  const { setUser } = useAuthContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step === 'signup') {
      if (!firstName.value) {
        setFirstName({ ...firstName, error: 'First name is required' });
        return;
      }
      if (!lastName.value) {
        setLastName({ ...lastName, error: 'Last name is required' });
        return;
      }
      if (!emailInput.value) {
        setEmailInput({ ...emailInput, error: 'Email is required' });
        return;
      }
      // Validate email using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        setEmailInput({ ...emailInput, error: 'Invalid email address' });
        return;
      }
      const { data, error } = await signUpMutation({
        params: {
          first_name: firstName.value,
          last_name: lastName.value,
          email: emailInput.value,
        },
      });
      if (error) {
        setEmailInput({ ...emailInput, error: error.message });
        return;
      }
      if (data.signup.message) {
        setStep('otp');
        return;
      }
    }

    // OTP step
    if (step === 'otp') {
      if (!otpInput.value) {
        setOtpInput({ ...otpInput, error: 'OTP is required' });
        return;
      }
      const { data, error } = await otpMutation({
        params: {
          otp: otpInput.value,
        },
      });
      if (error) {
        setOtpInput({ ...otpInput, error: error.message });
        return;
      }
      if (data.verify_otp.message) {
        setUser(data.verify_otp.user);
        onClose();
        return;
      }
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Sign up To Continue</ModalHeader>
          <Divider />
          <ModalCloseButton />
          <ModalBody>
            <br />
            {step === 'signup' && (
              <>
                <Stack direction='row'>
                  <FormControl isInvalid={Boolean(firstName.error)} isRequired>
                    <FormLabel requiredIndicator>First Name:</FormLabel>
                    <Input
                      required
                      placeholder='John'
                      _active={{
                        borderColor: 'purple.400',
                      }}
                      onChange={(e) =>
                        setFirstName({ value: e.target.value, error: '' })
                      }
                    />
                    <FormErrorMessage>{firstName.error}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={Boolean(lastName.error)} isRequired>
                    <FormLabel requiredIndicator>Last Name:</FormLabel>
                    <Input
                      required
                      placeholder='Doe'
                      _active={{
                        borderColor: 'purple.400',
                      }}
                      onChange={(e) =>
                        setLastName({ value: e.target.value, error: '' })
                      }
                    />
                    <FormErrorMessage>{lastName.error}</FormErrorMessage>
                  </FormControl>
                </Stack>
                <br />
                <FormControl isInvalid={Boolean(emailInput.error)} isRequired>
                  <FormLabel requiredIndicator>Email:</FormLabel>
                  <Input
                    required
                    type='email'
                    placeholder='hello@world.com'
                    _active={{
                      borderColor: 'purple.400',
                    }}
                    onChange={(e) =>
                      setEmailInput({ value: e.target.value, error: '' })
                    }
                  />

                  <FormErrorMessage>{emailInput.error}</FormErrorMessage>
                </FormControl>
              </>
            )}
            {step === 'otp' && (
              <FormControl isRequired>
                <FormLabel>OTP:</FormLabel>
                <HStack>
                  <PinInput
                    otp
                    value={otpInput.value}
                    onChange={(value) => setOtpInput({ value, error: '' })}
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
                {otpInput.error && (
                  <FormErrorMessage>{otpInput.error}</FormErrorMessage>
                )}
                <FormHelperText>
                  We've sent an OTP to your email. Please enter it here.
                </FormHelperText>
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              type='submit'
              colorScheme={'purple'}
              bg={'purple.400'}
              _hover={{ bg: 'purple.500' }}
              disabled={signUpRequest.fetching || otpRequest.fetching}
            >
              Continue
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
