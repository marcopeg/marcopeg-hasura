import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

export const LOAD_CURRENT_USER = gql`
  query loadCurrentUser {
    users { id }
  }
`;

export const useCurrentUser = () => {
  const { data } = useQuery(LOAD_CURRENT_USER);

  return {
    id: (data && data.users && data.users.length)
      ? data.users[0].id
      : null,
  };
};
