var express = require('express');

var routes = function () {
    var cardRouter = express.Router();
    var authController = require('../../controllers/v1/auth_controller')();
    var cardController = require('../../controllers/v1/card_controller')();

    cardRouter.route('/')
        .get(authController.requireAdmin, cardController.getAll);
    cardRouter.route('/random')
        .get(authController.requireAdmin, cardController.random);
    cardRouter.route('/:id')
        .get(authController.requireAdmin, cardController.getById);
    cardRouter.route('/')
        .post(authController.requireAdmin, cardController.create);
    cardRouter.route('/:id')
        .put(authController.requireAdmin, cardController.update);
    cardRouter.route('/:id')
        .delete(authController.requireAdmin, cardController.delete);

    return cardRouter;
};

module.exports = routes;