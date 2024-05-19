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
} from '@chakra-ui/react';
import { useMutation } from 'urql';

import { LOGIN, VERIFY_OTP } from '../grqphql/user';
import { useAuthContext } from '../hooks/use-auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('login');
  const [emailInput, setEmailInput] = useState({
    value: '',
    error: '',
  });
  const [otpInput, setOtpInput] = useState({
    value: '',
    error: '',
  });
  const [loginRequest, loginMutation] = useMutation(LOGIN);
  const [otpRequest, otpMutation] = useMutation(VERIFY_OTP);
  const { setUser } = useAuthContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step === 'login') {
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
      const { data, error } = await loginMutation({
        params: {
          email: emailInput.value,
        },
      });
      if (error) {
        setEmailInput({ ...emailInput, error: error.message });
        return;
      }
      if (data.login.message) {
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
          <ModalHeader>Login To Continue</ModalHeader>
          <Divider />
          <ModalCloseButton />
          <ModalBody>
            <br />
            {step === 'login' && (
              <FormControl isInvalid={Boolean(emailInput.error)} isRequired>
                <FormLabel>Email:</FormLabel>
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
                <FormHelperText>We'll never share your email.</FormHelperText>
              </FormControl>
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
              disabled={loginRequest.fetching || otpRequest.fetching}
            >
              Continue
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
