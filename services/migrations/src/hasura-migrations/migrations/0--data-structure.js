const down = async (hasura) => {
  console.log('DOWN 0')
  await hasura.untrackTable({
    schema: 'public',
    name: 'app_settings',
    cascade: true,
  }, { throw: false, log: 'dismantle' });

  await hasura.query(`
    DROP TABLE IF EXISTS app_settings;
  `, null, { throw: false, log: 'dismantle' });
}

const up = async (hasura) => {
  await down(hasura)
  console.log('RUN UP 0')
  await hasura.query(`
    CREATE TABLE app_settings (
      key VARCHAR(25) PRIMARY KEY,
      value jsonb DEFAULT '{}'::jsonb
    );
  `, null, { throw: false, log: 'build' });

  console.info("Track table: todos");
  const r2 = await hasura.call(
    {
      type: "track_table",
      args: {
        schema: "public",
        name: "app_settings"
      }
    },
    {
      throw: false
    }
  );
  console.log(r2.success ? r2 : r2.errors[0].response.data.error);
  console.log("\n");
}

module.exports = {
  stable: false,
  up,
  down,
};
