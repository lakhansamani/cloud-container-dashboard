import { gql } from 'urql';

export const GET_SESSION = gql`
  query session {
    session {
      message
      user {
        id
        first_name
        last_name
        email
        is_verified
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation signup($params: SignUpRequest!) {
    signup(params: $params) {
      message
    }
  }
`;

export const LOGIN = gql`
  mutation login($params: LoginRequest!) {
    login(params: $params) {
      message
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation verify_otp($params: VerifyOtpRequest!) {
    verify_otp(params: $params) {
      message
      user {
        id
        first_name
        last_name
        email
        is_verified
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation logout {
    logout {
      message
    }
  }
`;
