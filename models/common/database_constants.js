var apiConstants = function () {
    return {
        tables: {
            CARD: "cards"
        },
        size: {
            NAME: 200,
            EMAIL: 100,
            TITLE: 250,
            DESCRIPTION: 1000,
            ADDRESS: 500,
            IMAGE_URL: 200,
        },
        hiddenAuditFields: ['createdAt', 'updatedAt']
    };
};

module.exports = apiConstants();