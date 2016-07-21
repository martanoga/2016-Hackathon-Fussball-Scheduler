angular.module('fussball.scheduler.auth', [])

  .controller('AuthController', function ($scope) {
    console.log('Hello from auth controller');
    $scope.authenticationInProgress = false;

    $scope.startAuthentication = function () {
      $scope.authenticationInProgress = true;
      window.location = '/loginAutodesk';
    }
  })
  .factory('Auth', function ($http, $location, $rootScope) {
    var authenticated = false;
    return {
      isAuth: function () {
        authenticated = !!localStorage.getItem("fussball.scheduler");
        return authenticated;
      },
      signIn: function (user) {
        localStorage.setItem("fussball.scheduler", JSON.stringify(user));
        $rootScope.authenticated = true;
        $location.path("/channels");
      },
      signOut: function () {
        localStorage.removeItem("fussball.scheduler");
        //TBD: request to server to destroy user session
        $rootScope.authenticated = false;
        $location.path("signin");
      }
    };
  });