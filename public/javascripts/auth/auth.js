angular.module('fussball.scheduler.auth', [])

.controller('AuthController', function ($scope) {
   console.log('Hello from auth controller');
})
.factory('Auth', function ($http) {

  return {
    signout: function () {
       console.log('hello from factory auth');
    }
  };
});