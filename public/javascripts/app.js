angular.module('fussball.scheduler', [
    'ui.router',
    'fussball.scheduler.auth',
    'fussball.scheduler.channels'
])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
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
                    channels: function(Channels){
                        return Channels.getAll();
                    },
                    notifications: function(Notifications){
                        return Notifications.getAll();
                    }
                }
            })
    })