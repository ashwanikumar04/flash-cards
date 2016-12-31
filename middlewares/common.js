var CustomError = require("../models/common/errors/custom-error");
var errorCodes = require("../models/common/errors/error-codes");
var logger = require('../utils/logger');
var middlewares = function () {
    function corsMiddleWare(req, res, next) {

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        // Set custom headers for CORS
        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    }

    return {
        corsMiddleWare: corsMiddleWare
    };
};

module.exports = middlewares();