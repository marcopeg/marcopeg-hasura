const { FEATURE_NAME } = require('./hooks');
const { init: initApi } = require('./lib/api');
const { loadFromDisk } = require('./lib/disk');
const { query } = require('./lib/query');
const { up } = require('./lib/migrations');

const onInitService = ({ getConfig }) => {
  initApi({
    endpoint: `${getConfig('hasura.rootUrl')}/v1/query`,
    adminSecret: getConfig('hasura.adminSecret'),
  });
};

const onStartService = async () => {
  // get latest executed migration
  const lastMigration = await query({
    sql: 'SELECT * FROM app_settings WHERE key = $key',
    binds: { key: 'hasura.migrations.current' },
  });

  // retrive migrations and filter out old ones
  const lastEtag = lastMigration.length ? Number(lastMigration[0].value) : -1;
  const allMigrations = await loadFromDisk();

  // default migrate up
  await up(allMigrations, lastEtag);
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
