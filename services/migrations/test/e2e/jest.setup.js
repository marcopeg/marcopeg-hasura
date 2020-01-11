/* eslint no-await-in-loop:off */
/* eslint no-console:off */
const axios = require('axios');
const getEnv = require('./jest.env');

const env = getEnv();

const statusCheck = async () => {
  try {
    const res = await axios.get(env.TEST_STATUS_CHECK_URL);
    return res.status === 200 && res.data.message.includes('+ok');
  } catch (err) {
    return false;
  }
};

module.exports = async () => {
  console.log('');
  console.log(`[jest] await for server's health check...`);

  let isup = false;
  while (isup === false) {
    await new Promise((r) => setTimeout(r, env.TEST_STATUS_CHECK_INTERVAL));
    isup = await statusCheck();
  }

  console.log(`[jest] server is up...`);
};
