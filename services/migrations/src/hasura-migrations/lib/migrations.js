const { query } = require('./query');

const up = async (allMigrations, lastEtag) => {
  const activeMigrations = allMigrations
    .filter((migration) => migration.etag > lastEtag);

  // eslint-disable-next-line
  for (const migrationInfo of activeMigrations) {
    const { filePath, etag } = migrationInfo;
    // eslint-disable-next-line
    const migration = require(filePath);

    // execute the migration script
    // eslint-disable-next-line
    console.log(`#${migrationInfo.etag} up`);
    // eslint-disable-next-line
    await migration.up();

    // update the last etag setting if applicable
    if (migration.stable) {
      // eslint-disable-next-line
      const res = await query({
        sql: 'INSERT INTO app_settings ( key, value ) VALUES ( $key, $value ) ON CONFLICT ON CONSTRAINT app_settings_pkey DO UPDATE SET value = EXCLUDED.value;',
        binds: { key: 'hasura.migrations.current', value: String(etag) },
      });
      if (res.success) {
        const error = new Error('Could not promote a migration!');
        error.details = res.errors;
        throw error;
      }
    }
  }
};

module.exports = { up };
