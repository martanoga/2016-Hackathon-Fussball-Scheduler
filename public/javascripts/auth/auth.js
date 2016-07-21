angular.module('fussball.scheduler.auth', [])

  .controller('AuthController', function ($scope) {
    console.log('Hello from auth controller');
    $scope.authenticationInProgress = false;

    $scope.startAuthentication = function(){
      $scope.authenticationInProgress = true;
      window.location = '/loginAutodesk';
    }
  })
  .factory('Auth', function ($http, $location) {

    return {
      isAuth: function () {
        return !!localStorage.getItem("fussball.scheduler");
      },
      signout: function () {
        localStorage.removeItem("fussball.scheduler");
        //TBD: request to server to destroy user session
        $location.path("signin");
      }
    };
  });