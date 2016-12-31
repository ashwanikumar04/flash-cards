/*jslint node: true */
"use strict";
var _ = require('lodash');
var db = require("../../db");
var constants = require("../common/database_constants");
var extend = require('xtend');
var BaseModel = db.Bookshelf.Model.extend({
    parse: function (attr) {
        return _.reduce(attr, function (record, val, key) {
            record[_.camelCase(key)] = val;
            return record;
        }, {});
    },
    format: function (attr) {
        return _.reduce(attr, function (record, val, key) {
            record[_.snakeCase(key)] = val;
            return record;
        }, {});
    },
    toJSON: function (options) {
        return db.Bookshelf.Model.prototype.toJSON.call(this, extend(options || {}, {
            omitPivot: true
        }));
    }
});

module.exports = BaseModel;