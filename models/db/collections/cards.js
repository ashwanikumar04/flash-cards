/*jslint node: true */
"use strict";

var db = require("../../../db");
var constants = require("../../common/database_constants");

var cards = db.Bookshelf.Collection.extend({
    model: require("../card")
});

module.exports = cards;