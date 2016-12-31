(function () {
    function FlashCardTestController($scope, $location, $rootScope, flashCardService, Flash) {
        var vm = this;
        $rootScope.$emit("onTabChanged", 1);
        $scope.card = {
            isFrontShown: true
        };
        $scope.flip = function (card) {
            card.isFrontShown = !card.isFrontShown;
        };

        $scope.refresh = function () {
            getCard();
        };
        $scope.currentHintIndex = 0;
        $scope.showHints = function () {
            var hints = $scope.card.hints;
            if (hints.length > $scope.currentHintIndex) {
                $scope.currentHint = hints[$scope.currentHintIndex].hint;
                $scope.currentHintIndex++;
            } else {
                $scope.currentHint = "No more hints are available";
            }
        };
        $scope.areHintsAvailable = false;

        function getCard() {
            $scope.currentHint = null;
            $scope.currentHintIndex = 0;
            flashCardService
                .getRandom()
                .then(function (response) {
                    $scope.card = response.data.data;
                    $scope.card.isFrontShown = true;
                    if ($scope.card.hints) {
                        $scope.card.hints = JSON.parse($scope.card.hints);
                    }
                    $scope.areHintsAvailable = ($scope.card.hints && ($scope.card.hints.length > 0));
                }).catch(function (err) {
                    Flash.create('danger', err.data.message, 'custom-class');
                });

        }
        $scope.tinymceOptionsReadOnly = {
            plugins: 'codesample autoresize',
            toolbar: 'codesample',
            menubar: false,
            readonly: 1,
        };

        getCard();

    }
    angular.module('flashCard.controllers.cardsTest', [])
        .controller("FlashCardTestController", ['$scope', '$location', '$rootScope', 'flashCardService', "Flash", FlashCardTestController]);
}());