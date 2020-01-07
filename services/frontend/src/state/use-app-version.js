import * as serviceWorker from '../serviceWorker';

export const useAppVersion = () => {
  const current = {
    version: '0.0.0',
    build: 0,
  };

  const online = {
    version: '0.0.0',
    build: 0,
  };

  return {
    current: {
      version: current.version,
    },
    next: {
      version: online.version,
    },
    shouldUpdate: online.build > current.build,
    update: () => {
      serviceWorker.unregister();
      window.location.reload(true);
    },
  };
};
