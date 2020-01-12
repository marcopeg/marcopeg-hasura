const envalid = require('envalid');

module.exports = () => envalid.cleanEnv(process.env, {
  TEST_SERVER_ROOT: envalid.url({ default: 'http://localhost:8080' }),
  TEST_STATUS_CHECK_URL: envalid.url({ default: 'http://localhost:8080/test/status' }),
  TEST_STATUS_CHECK_INTERVAL: envalid.num({ default: 250 }),
});
