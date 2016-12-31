(function () {
    function CardController($scope, $location, $rootScope, flashCardService, Flash, ngDialog) {
        var vm = this;
        $scope.currentPage = 1;
        $scope.pageSize = 4;
        $scope.total = 0;
        $scope.dialogShown = false;
        $scope.dialogTitle = "";
        $scope.currentCard = {};
        $scope.getCards = getCards;
        $rootScope.$emit("onTabChanged", 0);
        $scope.reload = function () {
            getCards();
        };

        $scope.pageContent = function (action, page, pageSize, total) {
            $scope.currentPage = page;
            $scope.pageSize = pageSize;
            getCards();
        };

        function getCards() {
            flashCardService
                .getCards($scope.currentPage, $scope.pageSize)
                .then(function (response) {
                    $scope.cards = response.data.data.items;
                    for (var index = 0; index < $scope.cards.length; index++) {
                        $scope.cards[index].isFrontShown = true;
                    }
                    $scope.total = response.data.data.pagination.rowCount;
                }).catch(function (err) {
                    Flash.create('danger', err.data.message, 'custom-class');
                });

        }

        $scope.flip = function (card) {
            card.isFrontShown = !card.isFrontShown;
        };

        $scope.delete = function (card) {
            flashCardService
                .deleteCard(card.id)
                .then(function (response) {
                    getCards();
                }).catch(function (err) {
                    Flash.create('danger', err.data.message, 'custom-class');
                });
        };
        $scope.currentDialog = {};
        $scope.edit = function (card) {
            $scope.currentCard = card;
            $scope.currentCard.type = $scope.currentCard.type + "";

            $scope.currentDialog = ngDialog.open({
                template: '/templates/card.html',
                controller: 'CardModalController',
                scope: $scope
            });
        }
        $scope.add = function () {
            $scope.currentCard = {
                type: "1"
            };

            $scope.currentDialog = ngDialog.open({
                template: '/templates/card.html',
                controller: 'CardModalController',
                scope: $scope
            });
        };

        $scope.addOrUpdate = function () {
            if ($scope.currentCard.id) {
                flashCardService
                    .updateCard($scope.currentCard)
                    .then(function (response) {
                        $scope.dialogShown = false;
                        getCards();
                    }).catch(function (err) {
                        Flash.create('danger', err.data.message, 'custom-class');
                    });
            } else {
                flashCardService
                    .insertCard($scope.currentCard)
                    .then(function (response) {
                        getCards();
                    }).catch(function (err) {
                        Flash.create('danger', err.data.message, 'custom-class');
                    });
            }
        };

        $scope.tinymceOptions = {
            plugins: 'link image code codesample autoresize',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | codesample'
        };
        $scope.tinymceOptionsReadOnly = {
            plugins: 'codesample autoresize',
            toolbar: 'codesample',
            menubar: false,
            readonly: 1
        };
        getCards();
    }

    angular.module('flashCard.controllers.cards', [])
        .controller("CardController", ['$scope', '$location', '$rootScope', 'flashCardService', "Flash", "ngDialog", CardController]);
}());