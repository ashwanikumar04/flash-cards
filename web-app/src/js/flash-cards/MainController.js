(function () {
    var MainController = function ($scope, $rootScope, flashCardService, $location, Flash) {
        $scope.selectedTab = -1;
        $scope.isLoggedIn = false;
        $rootScope.$on("onTabChanged", function (event, tab) {
            console.log(tab);
            $scope.isLoggedIn = true;
            $scope.selectedTab = tab;
        });

        $scope.logout = function () {
            $scope.selectedTab = -1;
            $scope.isLoggedIn = false;
            flashCardService.logout(function () {
                $location.path('/login');
            });
        };
        $scope.reloadServer = function () {
            flashCardService
                .flushCache()
                .then(function (response) {
                    Flash.create('info', response.data.data.message, 'custom-class');
                }).catch(
                    function (error) {
                        Flash.create('danger', error.message, 'custom-class');
                    });
        };
    };
    angular.module('flashCard.controllers.main', [])
        .controller("MainController", ["$scope", "$rootScope", "flashCardService", '$location', "Flash", MainController]);
}());