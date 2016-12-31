/*jslint node: true */
var logger = require('../../utils/logger');
var responseMaker = require('../../utils/response-maker');
var CustomError = require('../../models/common/errors/custom-error');
var errorCodes = require('../../models/common/errors/error-codes');
var apiConstants = require('../../models/common/api-constants');

var config = require('../../config');

var helpers = require('../../utils/helpers');
var dateTimeUtil = require("../../utils/date-time-util");

var _ = require('lodash');
var authController = function () {

    var authenticate = function (req, res) {
        if (req.body.username === "admin" && req.body.password === config.adminPass) {
            return responseMaker.prepareResponse(null, {}, res);

        } else {
            return responseMaker.prepareResponse(new CustomError("Incorrect username and password", {
                errorCode: errorCodes.NOT_AUTHORIZED,
                extra: {
                    "metaData": req.metaData
                }
            }), null, res);
        }

    };

    var requireAdmin = function (req, res, next) {
        var token = req.body.token || req.params.token || req.headers['x-access-token'] || req.query.token;
        if (helpers.isAdmin(req)) {
            next();
        } else {
            return responseMaker
                .prepareResponse(new CustomError("Admin access is required.", {
                    errorCode: errorCodes.NOT_AUTHORIZED,
                    extra: {
                        url: helpers.getUrl(req)
                    }
                }), null, res);
        }
    };

    return {
        requireAdmin: requireAdmin,
        authenticate: authenticate

    };
};

module.exports = authController;