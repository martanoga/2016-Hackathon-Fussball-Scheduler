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
                controller: function (Auth) {
                    Auth.signout();
                }
            })
            .state('token', {
                url: '/token/:accessToken/:userId',
                template: '',
                controller: function ($location, $http, $stateParams) {
                    var user = {
                        userId: $stateParams.userId,
                        accessToken: $stateParams.accessToken
                    }
                    localStorage.setItem("fussball.scheduler", JSON.stringify(user));
                    $location.path("/channels");
                }
            })
            .state('channels', {
                url: '/channels',
                templateUrl: 'javascripts/channels/channels.html',
                controller: 'ChannelsController',
                authenticate: true,
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

        $httpProvider.interceptors.push('AttachUserData');
    })
    .factory('AttachUserData', function ($window) {
        var attach = {
            request: function (object) {
                var userData = JSON.parse($window.localStorage.getItem('fussball.scheduler'));
                if (userData) {
                    object.url += object.url.indexOf('?') == -1 ? '?' : "&";
                    object.url += "userId=" + userData.userId + "&accessToken=" + userData.accessToken;
                }
                return object;
            }
        };
        return attach;
    })
    .run(function ($rootScope, $location, Auth, $state) {
        $rootScope.$on("$stateChangeStart",
            function (event, toState, toParams, fromState, fromParams) {
                if (toState && toState.authenticate && !Auth.isAuth()) {
                    event.preventDefault();
                    console.log("unauthorized");
                    $state.go("signin");
                }
            }
        );
    });
