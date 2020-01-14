import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import * as serviceWorker from '../serviceWorker';

export const LOAD_APP_BUILD = gql`
  query loadAppBuild {
    build: app_settings(where: {key: {_eq: "client.web.build"}}) {
      value
    }
  }
`;

export const useAppVersion = () => {
  const { data } = useQuery(LOAD_APP_BUILD, { pollInterval: 5000 });

  const latestBuild = data && data.build && data.build.length ? data.build[0].value : 0;
  const currentBuild = 1;

  return {
    current: {
      version: currentBuild,
    },
    next: {
      version: latestBuild,
    },
    shouldUpdate: latestBuild > currentBuild,
    update: () => {
      serviceWorker.unregister();
      window.location.reload(true);
    },
  };
};
