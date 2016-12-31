/*jslint node: true */
var logger = require('../../utils/logger');
var responseMaker = require('../../utils/response-maker');
var CustomError = require('../../models/common/errors/custom-error');
var errorCodes = require('../../models/common/errors/error-codes');
var config = require('../../config');
var apiConstants = require('../../models/common/api-constants');
var db = require('../../db');
var Promise = require("bluebird");
var _ = require("lodash");

var Card = require("../../models/db/card");
var Cards = require("../../models/db/collections/cards");

var cardController = function () {

    var getAllCards = function getAllCards(req, res) {
        var currentPage = Number(req.query.currentPage);
        var currentPageSize = Number(req.query.pageSize);
        if (isNaN(currentPage)) {
            currentPage = 1;
        }
        if (isNaN(currentPageSize)) {
            currentPageSize = 10;
        }

        var dataQuery = Card
            .query(function (qb) {})
            .orderBy('-id')
            .fetchPage({
                pageSize: currentPageSize,
                page: currentPage
            });

        dataQuery.then(function (results) {

            var resultToSend = {};
            resultToSend.pagination = results.pagination;
            resultToSend.items = results.toJSON();

            logger.debug(resultToSend);
            return responseMaker
                .prepareResponse(null, resultToSend, res);
        }).catch(function (err) {
            return responseMaker
                .prepareResponse(err, null, res);
        });

    };

    var getById = function getById(req, res) {
        var id = req.params.id;

        var dataQuery = Card
            .fetchById(id);
        dataQuery.then(function (result) {
            if (result === null) {
                throw new CustomError("No card found", {
                    errorCode: errorCodes.NOT_FOUND,
                    extra: {
                        cardId: id
                    }
                });
            }
            return responseMaker
                .prepareResponse(null, result, res);
        }).catch(function (err) {
            return responseMaker
                .prepareResponse(err, null, res);
        });

    };

    function validateCard(req) {
        var front = req.body.front;
        var back = req.body.back;
        var type = Number(req.body.type);
        var hints = req.body.hints;
        if (hints !== null) {
            hints = JSON.stringify(hints);
        }
        if (_.isEmpty(front) || _.isEmpty(back) || isNaN(type)) {
            var errors = {};

            if (_.isEmpty(front)) {
                errors.front = 'Front of card is not provided.';
            }
            if (_.isEmpty(back)) {
                errors.back = 'Back of card is not provided.';
            }

            if (isNaN(type)) {
                errors.type = 'Type is not provided.';
            }
            throw new CustomError('Please provide correct data.', {
                errorCode: errorCodes.BAD_REQUEST,
                extra: {
                    errorDetails: errors
                }
            });
        }
        return {
            front: front,
            back: back,
            type: type,
            hints: hints
        };
    }

    var createCard = function create(req, res) {
        var dataToSave = validateCard(req);
        var newCard = Card.newEntry();

        var cardRequest = newCard.set(dataToSave).save();

        Promise.all([cardRequest])
            .then(function (results) {
                return responseMaker
                    .prepareResponse(null, {
                        id: results[0].get("id")
                    }, res);

            }).catch(function (err) {
                return responseMaker
                    .prepareResponse(err, null, res);
            });


    };

    var updateCard = function update(req, res) {
        var dataToSave = validateCard(req);
        var id = Number(req.params.id);
        if (isNaN(id)) {
            var errors = {};

            if (isNaN(id)) {
                errors.id = 'Id is not provided';
            }
            throw new CustomError('Please provide correct data.', {
                errorCode: errorCodes.BAD_REQUEST,
                extra: {
                    errorDetails: errors
                }
            });
        }
        Card
            .fetchById(id)
            .then(function (card) {
                if (card === null) {
                    throw new CustomError("No card found", {
                        errorCode: errorCodes.NOT_FOUND,
                        extra: {
                            cardId: id
                        }
                    });
                }
                var cardRequest = card.set(dataToSave).save();
                Promise.all([cardRequest])
                    .then(function (results) {
                        return responseMaker
                            .prepareResponse(null, results[0], res);

                    }).catch(function (err) {
                        return responseMaker
                            .prepareResponse(err, null, res);
                    });

            }).catch(function (err) {
                return responseMaker
                    .prepareResponse(err, null, res);
            });
    };

    var deleteCard = function deleteCard(req, res) {
        var id = req.params.id;
        var dataQuery = Card
            .fetchById(id);
        dataQuery.then(function (result) {
            if (result === null) {
                throw new CustomError("No card found", {
                    errorCode: errorCodes.NOT_FOUND,
                    extra: {
                        cardId: id
                    }
                });
            }
            result.destroy()
                .then(function (model) {
                    return responseMaker
                        .prepareResponse(null, {}, res);
                }).catch(function (err) {
                    return responseMaker
                        .prepareResponse(err, null, res);
                });

        }).catch(function (err) {
            return responseMaker
                .prepareResponse(err, null, res);
        });

    };

    var getRandom = function getRandom(req, res) {
        var query = "SELECT * FROM cards ORDER BY RANDOM() LIMIT 1";
        var dataQuery = db.Knex.raw(query);
        dataQuery
            .then(function (result) {
                if (result === null) {
                    throw new CustomError("No card found", {
                        errorCode: errorCodes.NOT_FOUND,
                        extra: {
                            cardId: id
                        }
                    });
                }
                return responseMaker
                    .prepareResponse(null, result[0], res);
            }).catch(function (err) {
                return responseMaker
                    .prepareResponse(err, null, res);
            });
    };
    return {
        getAll: getAllCards,
        getById: getById,
        create: createCard,
        update: updateCard,
        delete: deleteCard,
        random: getRandom
    };
};

module.exports = cardController;