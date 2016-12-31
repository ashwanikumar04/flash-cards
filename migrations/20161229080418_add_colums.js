var constants = require("../models/common/database_constants");
var apiConstants = require("../models/common/api-constants");
exports.up = function (knex, Promise) {
    return knex.schema.hasTable(constants.tables.CARD).then(function (exists) {
        if (exists) {
            return knex.schema.table(constants.tables.CARD, function (tbl) {
                tbl.text('hints').nullable();
            });
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table(constants.tables.CARD, function (tbl) {
        tbl.dropColumn('hints');
    });
};