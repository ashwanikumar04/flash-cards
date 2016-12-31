/*jslint node: true */
"use strict";

//Utils module loaded
var util = require('util');
var errorCode = require("./error-codes");

function CustomError(message, args) {
    if (!args) {
        args = {};
        args.errorCode = errorCode.INTERNAL_SERVER_ERROR;
        args.extra = "";
    }

    Error.call(this); //super constructor
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object
    this.errorCode = args.errorCode;
    //Set the name for the ERROR
    this.name = this.constructor.name; //set our function’s name as error name.
    //Define error message
    this.message = message;
    this.extra = args.extra;
}

// inherit from Error
util.inherits(CustomError, Error);

//Export the constructor function as the export of this module file.
exports = module.exports = CustomError;