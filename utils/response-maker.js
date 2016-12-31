var apiConstants = require("../models/common/api-constants");
var logger = require("./logger");
var camelize = require('camelize');
var dateTimeUtil = require("./date-time-util");
dateTimeUtil.setMoment();
var customError = require("../models/common/errors/custom-error");
var errorCodes = require("../models/common/errors/error-codes");
var responseMaker = function () {

    function getResponse() {
        return {
            "timestamp": dateTimeUtil.getEPOCHTime(),
            "data": {}
        };
    }

    function getError(errorCode) {
        var response = getResponse();
        response.message = "Some error occurred.";
        return response;

    }

    function getDataResponse(rows) {
        var response = getResponse();
        response.isSuccess = true;
        response.data = rows;
        return response;
    }

    function toCamel(args, dataToSend) {
        if (args.isCamel) {
            return camelize(dataToSend);
        } else {
            return dataToSend;
        }

    }

    var prepareResponse = function prepareResponse(err, cachedData, res, args) {
        if (!args) {
            args = {};
            args.logError = true;
        }
        if (!err) {
            if (cachedData.data) {
                if (!args.hasOwnProperty("setCacheHeaders") || args.setCacheHeaders === true) {
                    res.setHeader('Cache-Control', "private, max-age=" + Math.round((cachedData.expiresOn - (dateTimeUtil.getEPOCHTime()))));
                    res.setHeader('Expires', dateTimeUtil.getDateFromEpoch(cachedData.expiresOn).format());
                }
                res.json(toCamel(args, getDataResponse(cachedData.data)));
            } else {
                res.json(toCamel(args, getDataResponse(cachedData)));
            }

        } else {

            res.status(errorCodes.INTERNAL_SERVER_ERROR);
            if (args.statusCode) {
                res.status(args.statusCode);
            }
            if (err instanceof customError) {
                res.status(err.errorCode);
                if (err.errorCode !== errorCodes.INTERNAL_SERVER_ERROR) {
                    args.toSendError = true;
                }
            }
            var error = getError(apiConstants.errorCodes.Normal);
            if (args.toSendError && args.toSendError === true) {
                error.message = err.message;
                if (err.extra && err.extra.errorDetails) {
                    error.errorDetails = err.extra.errorDetails;
                }
                if (args.errorCode) {
                    error.errorCode = args.errorCode;
                }
            }
            if (!args.hasOwnProperty("logError") || args.logError === true) {
                var extra = {};
                if (err.url) {
                    extra.url = err.url;
                }
                logger.error(err, extra);
            }

            res.json(toCamel(args, error));
        }
    };

    return {
        prepareResponse: prepareResponse
    };
};

module.exports = responseMaker();