angular.module('fussball.scheduler.channels', [])

.controller('ChannelsController', function ($scope) {
   console.log('Hello from channels controller');
})

.directive('channel', function () {
  return {
    templateUrl: '<div></div>'
  };
})
.factory('Channels', function ($http) {

  return {
    getAll: function () {
       console.log('hello from factory channels');
    //   return $http({
    //     method: 'GET',
    //     url: '/api/links'
    //   })
    //     .then(function (resp) {
    //       return resp.data;
    //     });
    }
  };
});