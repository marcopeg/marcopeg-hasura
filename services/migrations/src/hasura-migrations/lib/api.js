const axios = require('axios');

const settings = {};

const init = (receivedSettings = {}) => {
  Object.keys(receivedSettings).forEach((key) => {
    settings[key] = receivedSettings[key];
  });
};

const call = async (payload, options = { throw: true }) => {
  try {
    const res = await axios.post(settings.endpoint, payload, {
      headers: {
        'x-hasura-admin-secret': settings.adminSecret,
      },
    });

    return { success: true, data: res.data };
  } catch (err) {
    const details = { success: false, errors: [err] };
    if (options.log) {
      console.error(`${options.log} - ${err.message}`);
      console.error(err.response.data);
    }
    if (options.throw) {
      const error = new Error(err.message);
      error.details = details;
      throw error;
    }
    return details;
  }
};

const trackTable = (args = {}, log) => call({
  type: 'track_table',
  args,
}, {
  throw: log !== undefined,
  log: `Op "track_table" on "${args.schema}.${args.name}"`,
});

const untrackTable = (args = {}, log) => call({
  type: 'untrack_table',
  args: {
    table: {
      schema: args.schema,
      name: args.name,
    },
    cascade: args.cascade,
  },
}, {
  throw: log !== undefined,
  log: `Op "untrack_table" on "${args.schema}.${args.name}"`,
});

const trackFunctionWithSession = (args = {}, log) => call({
  type: 'track_function',
  version: 2,
  args: {
    function: {
      schema: args.schema,
      name: args.name,
    },
    configuration: {
      session_argument: 'hasura_session',
    },
  },
}, {
  throw: log !== undefined,
  log: `Op "track_function (v2 with session)" on "${args.schema}.${args.name}"`,
});

const untrackFunction = (args = {}, log) => call({
  type: 'untrack_function',
  args,
}, {
  throw: log !== undefined,
  log: `Op "untrack_function" on "${args.schema}.${args.name}"`,
});

const createSelectPermission = (args = {}, log) => call({
  type: 'create_select_permission',
  args,
}, {
  throw: log !== undefined,
  log: `Op "create_select_permission" on "${args.schema}.${args.name}"`,
});

module.exports = {
  init,
  call,
  trackTable,
  untrackTable,
  trackFunctionWithSession,
  untrackFunction,
  createSelectPermission,
};
