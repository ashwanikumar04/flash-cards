var express = require('express');

var routes = function () {
    var authRouter = express.Router();
    var authController = require('../../controllers/v1/auth_controller')();
    authRouter.route('/authenticate')
        .post(authController.authenticate);
    return authRouter;
};

module.exports = routes;