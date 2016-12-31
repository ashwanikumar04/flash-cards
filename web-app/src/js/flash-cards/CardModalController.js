(function () {
    function CardModalController($scope, $location, $rootScope, flashCardService, Flash, ngDialog) {
        var vm = this;
        $scope.cancel = function () {
            $scope.currentDialog.close();
        };
        var pushFirstElement = false;
        if ($scope.currentCard.hints) {
            $scope.currentCard.hints = JSON.parse($scope.currentCard.hints);
            if ($scope.currentCard.hints.length === 0) {
                pushFirstElement = true;
            }
        } else {
            pushFirstElement = true;
        }
        if (pushFirstElement) {
            $scope.currentCard.hints = [{
                hint: ""
            }];
        }
        $scope.addHint = function () {
            $scope.currentCard.hints.push({
                hint: ""
            });
        };
        $scope.addOrUpdate = function () {
            $scope.currentCard.type = Number($scope.currentCard.type);
            var hints = [];
            var cardHints = $scope.currentCard.hints;
            if (cardHints && cardHints.length > 0) {
                for (var index = 0; index < cardHints.length; index++) {
                    if (cardHints[index].hint !== null && cardHints[index].hint !== "") {
                        hints.push(cardHints[index]);
                    }
                }
            }
            $scope.currentCard.hints = hints;
            if ($scope.currentCard.id) {
                flashCardService
                    .updateCard($scope.currentCard)
                    .then(function (response) {
                        $scope.currentDialog.close();
                        $scope.getCards();
                    }).catch(function (err) {
                        Flash.create('danger', err.data.message, 'card-error');
                    });
            } else {
                flashCardService
                    .insertCard($scope.currentCard)
                    .then(function (response) {
                        $scope.currentDialog.close();
                        $scope.getCards();
                    }).catch(function (err) {
                        Flash.create('danger', err.data.message, 'card-error');
                    });
            }
        };

        $scope.tinymceOptions = {
            plugins: 'link image code codesample autoresize',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | codesample'
        };
    }

    angular.module('flashCard.controllers.cardModal', [])
        .controller("CardModalController", ['$scope', '$location', '$rootScope', 'flashCardService', "Flash", "ngDialog", CardModalController]);
}());