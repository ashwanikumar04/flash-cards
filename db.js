/*jslint node: true */

"use strict";
var config = require("./config");
var knxCfg = require('./knexfile')[config.environment];
var knex = require("knex")(knxCfg);

var Bookshelf = require("bookshelf")(knex);
Bookshelf.plugin(["registry", "visibility", "pagination"]);
module.exports.Bookshelf = Bookshelf;
module.exports.Knex = knex;