angular.module('fussball.scheduler', [
    'ui.router',
    'fussball.scheduler.auth',
    'fussball.scheduler.channels',
    'ngMaterial'
])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $mdThemingProvider) {
        //$urlRouterProvider.otherwise('/channels');

        $stateProvider
            .state('signin', {
                url: '/signin',
                templateUrl: 'javascripts/auth/signin.html',
                controller: 'AuthController'
            })
            .state('signout', {
                url: '/signout',
                controller: 'AuthController'
            })
            .state('token', {
                url: '/token/',
                template: '',
                controller: function ($location, $http) {
                    $http({
                        method: 'GET',
                        url: '/api/token'
                    })
                        .then(function (resp) {
                            localStorage.setItem("fussbal.scheduler", "cos");
                            $location.path("/channels");
                        });

                }
            })
            .state('channels', {
                url: '/channels',
                templateUrl: 'javascripts/channels/channels.html',
                controller: 'ChannelsController',
                resolve: {
                    channels: function (Channels) {
                        return Channels.getAll();
                    },
                    notifications: function (Notifications) {
                        return Notifications.getAll();
                    }
                }
            })

        $mdThemingProvider.theme('grey').backgroundPalette('grey').dark();
        $mdThemingProvider.theme('orange').backgroundPalette('orange').dark();
        $mdThemingProvider.theme('green').backgroundPalette('green').dark();
    })
    .controller('NagigationCtrl', AppCtrl);

function AppCtrl($scope) {
    $scope.currentNavItem = 'page2';
}