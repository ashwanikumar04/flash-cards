var config = require('./config');
module.exports = {

    development: {
        client: "sqlite3",
        connection: {
            filename: "./db/flash-cards.db"
        },
        migrations: {
            tableName: 'knex_migrations'
        },
        debug: config.dbDebug,
        useNullAsDefault: false
    }
};