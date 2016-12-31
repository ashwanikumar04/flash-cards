/*jslint node: true */
"use strict";

var db = require("../../db");
var constants = require("../common/database_constants");
var base_model = require("./base_model");


var card = base_model.extend({
    tableName: constants.tables.CARD,
    idAttribute: 'id',
    hasTimestamps: false
}, {
    fetchById: function (id, args) {
        return new this({
            id: id
        }).fetch({});
    },
    newEntry: function () {
        return new this();
    }
});

module.exports = db.Bookshelf.model('card', card);