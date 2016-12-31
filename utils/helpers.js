var config = require('../config');
var CustomError = require("../models/common/errors/custom-error");
var dateTimeUtil = require("./date-time-util");

var errorCodes = require("../models/common/errors/error-codes");

var helpers = function () {

    var isAdmin = function checkAdmin(req) {
        var token = req.body.token || req.params.token || req.headers['x-access-token'] || req.query.token || req.body.password;
        var adminData = {};
        adminData.isAdmin = false;
        if (token) {
            adminData.isAdmin = (token === config.adminPass);
        }

        return adminData.isAdmin;
    };

    var replaceAll = function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    };
    var getParam = function getParam(req, param) {
        var returnParam = req.body[param] || req.params[param] || req.headers[param] || req.query[param];
        return returnParam;
    };
    var getUrl = function getUrl(req) {
        return req.protocol + '://' + req.get('host') + req.originalUrl;
    };

    return {
        isAdmin: isAdmin,
        replaceAll: replaceAll,
        getParam: getParam,
        getUrl: getUrl
    };
};
module.exports = helpers();