var ErrorCodes = function () {
    return {
        "BAD_REQUEST": 400,
        "NOT_AUTHORIZED": 401,
        "NOT_FOUND": 404,
        "RESOURCE_CONFLICT": 409,
        "PRE_CONDITION_FAILED": 412,
        "INTERNAL_SERVER_ERROR": 500
    };
};

module.exports = ErrorCodes();