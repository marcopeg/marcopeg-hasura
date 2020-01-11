const { runHookApp } = require('@forrestjs/hooks');
const envalid = require('envalid');

// Services
const serviceEnv = require('@forrestjs/service-env');

// Features
const hasuraMigrations = require('./hasura-migrations');

const logLevelConfig = {
  default: 'info',
  choices: ['error', 'info', 'verbose', 'debug'],
};

const nodeEnvConfig = {
  choices: ['production', 'development', 'test'],
};

const settingsHandler = ({ setContext, setConfig }) => {
  // Validate environment and apply default values
  const env = envalid.cleanEnv(process.env, {
    NODE_ENV: envalid.str(nodeEnvConfig),
    LOG_LEVEL: envalid.str(logLevelConfig),
    HASURA_API_ENDPOINT: envalid.url(),
    HASURA_GRAPHQL_ADMIN_SECRET: envalid.str(),
  });

  // Store the validated environment with the App's context
  setContext('env', env);

  // Setup Hasura's config
  setConfig('hasura.rootUrl', env.HASURA_API_ENDPOINT);
  setConfig('hasura.adminSecret', env.HASURA_GRAPHQL_ADMIN_SECRET);
};

runHookApp({
  // trace: 'compact',
  settings: settingsHandler,
  features: [hasuraMigrations],
  services: [serviceEnv],
});
