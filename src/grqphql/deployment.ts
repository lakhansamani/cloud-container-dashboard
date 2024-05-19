import { gql } from 'urql';

export const LIST_DEPLOYMENTS = gql`
  query deployments {
    deployments {
      id
      name
      image
      status
      env_vars
      container_id
    }
  }
`;

export const CREATE_DEPLOYMENT = gql`
  mutation create_deployment($params: CreateDeploymentRequest!) {
    create_deployment(params: $params) {
      id
      name
      image
      status
      env_vars
      container_id
    }
  }
`;

export const DELETE_DEPLOYMENT = gql`
  mutation delete_deployment($params: DeleteDeploymentRequest!) {
    delete_deployment(params: $params) {
      message
    }
  }
`;
