(function () {
    function LoginController($location, flashCardService, Flash) {
        var vm = this;

        vm.login = login;

        function login() {
            vm.dataLoading = true;
            flashCardService
                .login(vm.username, vm.password)
                .then(function (response) {
                    flashCardService.setCredentials(vm.username, vm.password);
                    vm.dataLoading = false;
                    $location.path('/index');
                }).catch(function (err) {
                    Flash.create('danger', err.data.message, 'custom-class');
                    vm.dataLoading = false;
                });

        }
    }

    angular.module('flashCard.controllers.login', [])
        .controller("LoginController", ['$location', 'flashCardService', "Flash", LoginController]);
}());