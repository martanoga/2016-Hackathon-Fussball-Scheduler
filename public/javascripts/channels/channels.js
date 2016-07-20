angular.module('fussball.scheduler.channels', [])

  .controller('ChannelsController', function ($scope, channels, Channels) {
    console.log('Hello from channels controller');
    $scope.channels = channels;

    $scope.subscribe = function () {
      console.log("Subscribe!", this.channel.name);
      //TBD: post to server
      //this should be done in callabck
      this.channel.subscribed = true;
    };
    $scope.unsubscribe = function () {
      console.log("Unsubscribe!", this.channel.name);
      //TBD: post to server
      //this should be done in callabck
      this.channel.subscribed = false;
      this.channel.joined = false;
    };
    $scope.startEvent = function () {
      console.log("Start event", this.channel.name);
      //TBD: post to server
      //this should be done in callabck
      this.channel.eventInProgress = true;
    };
    $scope.joinEvent = function () {
      console.log("Join event", this.channel.name);
      //TBD: post to server
      //this should be done in callabck
      this.channel.joined = true;
    };

    $scope.cancelEvent = function () {
      Channels.onEventCanceled($scope.channels[0].id);
    }
    $scope.makeEventHappen = function () {
      Channels.onEvenHappens($scope.channels[0].id);
    }
  })

  .directive('channel', function () {
    return {
      templateUrl: 'javascripts/channels/channel.html'
    };
  })
  .factory('Channels', function ($http) {
    var channels = [];
    return {
      getAll: function () {
        channels = [{
          name: "Piłkarzyki",
          id: "0-adsf-adsf",
          eventInProgress: false,
          subscribed: false
        },
          {
            name: "Pizza",
            id: "1-adsf-adsf",
            eventInProgress: false,
            subscribed: false
          }
        ];
        console.log('hello from factory channels');
        return channels;
        //   return $http({
        //     method: 'GET',
        //     url: '/api/links'
        //   })
        //     .then(function (resp) {
        //       return resp.data;
        //     });
      },
      onEventCanceled: function (channelId) {
        for (var i = 0; i < channels.length; i++) {
          if (channels[i].id === channelId) {
            channels[i].eventInProgress = false;
            channels[i].joined = false;
            console.log("Event canceled: ", channels[i].name);
          }
        }
      },
      onEvenHappens: function (channelId) {
        for (var i = 0; i < channels.length; i++) {
          if (channels[i].id === channelId) {
            channels[i].eventInProgress = false;
            channels[i].joined = false;
            //TBD: display notification!
            console.log("Event it happening: ", channels[i].name);
          }
        }
      }
    };
  });