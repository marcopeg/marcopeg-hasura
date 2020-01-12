const path = require('path');
const hasura = require('hasura-sdk');
const { FEATURE_NAME } = require('./hooks');

const onInitService = ({ getConfig }) => {
  hasura.init({
    endpoint: `${getConfig('hasura.rootUrl')}/v1/query`,
    adminSecret: getConfig('hasura.adminSecret'),
  });
};

const onStartService = async () => {
  // get latest executed migration
  const lastMigration = await hasura.query({
    sql: 'SELECT * FROM app_settings WHERE key = $key',
    binds: { key: 'hasura.migrations.current' },
  });

  // retrive migrations and filter out old ones
  const lastEtag = lastMigration.length ? Number(lastMigration[0].value) : -1;
  const allMigrations = await hasura.loadFromDisk(path.join(__dirname, 'migrations'));

  // default migrate up
  await hasura.up(allMigrations, lastEtag);
};

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$INIT_SERVICE',
    name: FEATURE_NAME,
    trace: __filename,
    handler: onInitService,
  });
  registerAction({
    hook: '$START_SERVICE',
    name: FEATURE_NAME,
    trace: __filename,
    handler: onStartService,
  });
};
