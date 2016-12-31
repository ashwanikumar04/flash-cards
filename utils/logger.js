var winston = require('winston');
var moment = require('moment');
winston.emitErrs = true;
var dateTimeUtil = require("./date-time-util");
dateTimeUtil.setMoment();
var CustomError = require("../models/common/errors/custom-error");
require('winston-loggly');
var config = require("../config");
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/logs.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

var customLogger = {
    info: function (message, extra) {
        if (extra) {
            logger.info(message, extra);
        } else {
            logger.info(message);
        }
    },
    debug: function (message, extra) {
        message = JSON.stringify(message, null, 4);
        if (config.debug) {
            if (extra) {
                logger.debug(message, extra);
            } else {
                logger.debug(message);
            }
        }
    },
    error: function (error, extra) {
        if (error instanceof CustomError) {
            var extraToPass = {};
            if (extra) {
                extraToPass.extra = extra;
                extraToPass.errorData = error.extra;
            } else {
                extraToPass.errorData = error.extra;
            }
            extraToPass.stact = error.stack;
            extra = extraToPass;
        }
        if (extra) {
            logger.error(error, extra);
        } else {
            logger.error(error);
        }
    },
    logger: logger
};


module.exports = customLogger;