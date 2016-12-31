(function () {
    angular
        .module('flashCard', ["ngRoute",
            "flashCard.controllers.main",
            "flashCard.controllers.login",
            "flashCard.controllers.cards",
            "flashCard.controllers.cardModal",
            "flashCard.controllers.cardsTest",
            'flashCard.services',
            'angular-loading-bar',
            'ngAnimate',
            "flash",
            "LocalStorageModule",
            "ngDialog",
            "bw.paging",
            "ui.tinymce"
        ])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider', 'cfpLoadingBarProvider', 'ngDialogProvider'];

    function config($routeProvider, $locationProvider, cfpLoadingBarProvider, ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            width: "75%",
            height: "40%"
        });
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.parentSelector = '#loadingContainer';
        cfpLoadingBarProvider.spinnerTemplate = '<div class="center"><img src="/images/loading.svg"></div>';
        $routeProvider
            .when("/", {
                templateUrl: "cards.html",
                controller: "CardController"
            })
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login.html',
                controllerAs: 'vm'
            })
            .when('/test', {
                controller: 'FlashCardTestController',
                templateUrl: 'flash-card-test.html'
            })
            .when("/index", {
                templateUrl: "cards.html",
                controller: "CardController"
            })
            .otherwise({
                redirectTo: '/login'
            });

    }

    run.$inject = ['$rootScope', '$location', '$http', "localStorageService"];

    function addHeader($rootScope, $http) {
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['x-access-token'] = $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
    }

    function redirect($rootScope, $location, $http) {
        addHeader($rootScope, $http);
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }
    }

    function run($rootScope, $location, $http, localStorageService) {
        $rootScope.globals = localStorageService.get("flash_card_creds") || {};
        addHeader($rootScope, $http);
        redirect($rootScope, $location, $http);
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            redirect($rootScope, $location, $http);
        });
    }
}());