(function () {
    var flashCardService = function ($http, $location, $rootScope, localStorageService) {
        var login = function (username, password, callback) {
            return $http.post('/api/v1/authenticate', {
                username: username,
                password: password
            });
        };
        var logout = function (callback) {
            localStorageService.remove("flash_card_creds");
            $rootScope.globals = {};
            callback();
        };

        var setCredentials = function (username, password) {
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: password
                }
            };
            localStorageService.set("flash_card_creds", {
                currentUser: {
                    username: username,
                    authdata: password
                }
            });
        };

        var getCards = function (currentPage, pageSize) {
            return $http.get('/api/v1/cards', {
                params: {
                    currentPage: currentPage,
                    pageSize: pageSize
                }
            });
        };

        var updateCard = function (card) {
            return $http.put('/api/v1/cards/' + card.id, card);
        };
        var insertCard = function (card) {
            return $http.post('/api/v1/cards', card);
        };

        var deleteCard = function (id) {
            return $http.delete('/api/v1/cards/' + id);
        };


        var getRandom = function (currentPage, pageSize) {
            return $http.get('/api/v1/cards/random');
        };

        return {
            login: login,
            logout: logout,
            setCredentials: setCredentials,
            getCards: getCards,
            deleteCard: deleteCard,
            updateCard: updateCard,
            insertCard: insertCard,
            getRandom: getRandom
        };



    };
    angular.module('flashCard.services', [])
        .factory("flashCardService", ["$http", "$location", '$rootScope', "localStorageService", flashCardService]);
}());