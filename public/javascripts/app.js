angular.module('fussball.scheduler', [
    'ui.router',
    'fussball.scheduler.auth',
    'fussball.scheduler.channels',
    'ngMaterial'
])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $mdThemingProvider) {
        $urlRouterProvider.otherwise('/channels');

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