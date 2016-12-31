/*jslint node: true */

var request = require('request');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var compress = require('compression');
var fs = require('fs');
var path = require('path');
var config = require('./config');
var serveStatic = require('serve-static');
var helpers = require('./utils/helpers');
var db = require("./db");
var logger = require("./utils/logger");

///Required to initialize all the models. Add new models here.
var modelInitializer = require('./model-initializer');
var CustomError = require("./models/common/errors/custom-error");
var errorCodes = require("./models/common/errors/error-codes");
var commonMiddleware = require('./middlewares/common');
var expressWinston = require('express-winston');
var winston = require('winston');

var dbConfig = require('./knexfile')[config.environment];

require('dotenv').config();
if (config.debug) {
    app.use(compress());
}
app.disable('etag');
app.disable('x-powered-by');
app.all('/*', commonMiddleware.corsMiddleWare);
app.use(serveStatic(__dirname + '/public', {
    maxAge: '5d',
    setHeaders: setCustomCacheControl
}));
var useragent = require('useragent');
useragent(true);
var trimBody = require('connect-trim-body');

function setCustomCacheControl(res, path) {
    if (serveStatic.mime.lookup(path) === 'text/html') {
        // Custom Cache-Control for HTML files
        res.setHeader('Cache-Control', 'public, max-age=0');
    }
}

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(trimBody());
var listeningPort = process.env.PORT || 8091;
var responseMaker = require("./utils/response-maker");

var apiRoutes = express.Router();
//app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

app.use(function (err, req, res, next) {
    return responseMaker.prepareResponse(err, null, res);
});

apiRoutes.get('/', function (req, res) {
    res.redirect('/index.html');
});


var authRoute = require('./routes/v1/auth_route')();
var cardRoute = require('./routes/v1/card_route')();


app.use('/', function (req, res, next) {
    var agent = useragent.lookup(req.headers['user-agent']);
    req.userAgent = agent;
    logger.debug(agent);
    next();
});
if (config.debug) {
    app.use(expressWinston.logger({
        transports: [
            new winston.transports.File({
                level: 'info',
                filename: './logs/logs.log',
                handleExceptions: true,
                json: true,
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: false
            }),
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: true,
                colorize: true
            })
        ]
    }));
}
app.use('/', apiRoutes);
app.use('/api/v1/', authRoute);
app.use('/api/v1/cards', cardRoute);

process.on("unhandledRejection", function (promise, reason) {
    logger.error("Error occurred", promise, reason);
});

process.on('uncaughtException', function (err) {
    logger.error(err);
    throw err;
});


app.use(function (req, res, next) {
    var err = new CustomError('End point not found.', {
        errorCode: errorCodes.NOT_FOUND
    });
    next(err);
});

app.use(function (err, req, res, next) {
    err.isNotReThrow = true;
    err.url = helpers.getUrl(req);
    return responseMaker.prepareResponse(err, null, res);
});

var http = require('http').Server(app);

var server = http.listen(listeningPort, function () {
    var port = server.address().port;
    logger.info("Server started at port: " + port + ' with url: ' + config.serverURL);
});