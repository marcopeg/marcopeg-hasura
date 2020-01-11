const { call } = require('./api');

const getInputStr = (data) => {
  switch (typeof data) {
    case 'number':
    case 'boolean':
      return data;
    case 'string':
      return `'${data}'`;
    case 'object':
      return `'${JSON.stringify(data)}'`;
    default:
      throw new Error(`unknown data type "${typeof data}"`);
  }
};

const createSql = (receivedSql, binds) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  receivedSql.replace(/\$\w+/g, (all) => {
    const value = binds[all.substr(1)];
    return value ? getInputStr(value) : all;
  });

const execSql = async (sql, binds = {}) => {
  if (typeof sql === 'object') {
    return execSql(sql.sql, sql.binds);
  }

  try {
    return await call({
      type: 'run_sql',
      args: {
        sql: createSql(sql, binds),
      },
    });
  } catch (err) {
    if (err && err.response && err.response.data) {
      const { data } = err.response;
      const error = new Error(data.error);
      error.details = data;
      error.originalError = err;
      throw error;
    }

    const error = new Error(err.message);
    error.details = {};
    error.originalError = err;
    throw error;
  }
};

const result2obj = (result) => {
  const [fields, ...results] = result;
  return results.map((values) => values.reduce((acc, curr, i) => ({
    ...acc,
    [fields[i]]: curr,
  }), {}));
};

const query = async (sql, binds = {}, options = { throw: true }) => {
  if (typeof sql === 'object') {
    return query(sql.sql, sql.binds, sql.options);
  }

  try {
    const { data } = await execSql(sql, binds);
    const { result_type: resultType, result } = data;
    switch (resultType) {
      case 'CommandOk':
        return { success: true, data: result || {} };
      case 'TuplesOk':
        return Array.isArray(result) ? result2obj(result) : result;
      default:
        throw new Error(`Unexpected resultType: "${resultType}"`);
    }
  } catch (err) {
    const details = { success: false, errors: [err] };
    if (options.log) {
      console.error(`${options.log} - ${err.message}`);
    }
    if (options.throw) {
      const error = new Error(err.message);
      error.details = details;
      throw error;
    }
    return details;
  }
};

module.exports = { execSql, query };
