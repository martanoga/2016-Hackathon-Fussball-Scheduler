angular.module('fussball.scheduler.channels', [])

  .controller('ChannelsController', function ($scope, channels, Channels, notifications, Notifications) {
    $scope.currentNavItem = 'page1';
    console.log('Hello from channels controller');
    $scope.channels = channels;
    $scope.notifications = notifications;

    for (var i = 0; i < channels.length; i++) {
      if (channels[i].subscribed) {
        Notifications.subscribe(channels[i].id, function (m) {
          $scope.subscribeCallback(m, channels[i].id);
        });
      }
    }

    $scope.getTheme = function () {
      if (this.channel.subscribed) {
        if (this.channel.eventInProgress) {
          if (this.channel.joined) {
            return 'dark-green';
          }
          return 'dark-orange';
        }
        return 'default';
      }
      return 'dark-grey';
    }
    $scope.subscribe = function () {
      console.log("Subscribe!", this.channel.name);
      //TBD: post to server
      //this should be done in callabck
      this.channel.subscribed = true;
      Notifications.subscribe(this.channel.id, function (m) {
        $scope.subscribeCallback(m, this.channel.id);
      });
    };
    $scope.unsubscribe = function () {
      console.log("Unsubscribe!", this.channel.name);
      //TBD: post to server
      //this should be done in callabck
      this.channel.subscribed = false;
      this.channel.joined = false;
      Notifications.unsubscribe(this.channel.id);
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

    $scope.subscribeCallback = function (m, channelId) {
      if (m.type = 'HAPPEN') {
        Channels.onEvenHappens(channelId);
      } else if (m.type = 'CANCEL') {
        Channels.onEventCanceled(channelId);
      }
    }
  })

  .directive('channel', function () {
    return {
      templateUrl: 'javascripts/channels/channel.html'
    };
  })
  .factory('Notifications', function () {
    var notifications = [];
    var pubnub = PUBNUB({
      subscribe_key: 'SUBSCRIBE_KEY',
      cipher_key: 'CIPHER_KEY'
    });
    return {
      subscribe: function (channelId, callback) {
        pubnub.subscribe({
          channel: channelId,
          callback: function (m) {
            console.log(m);
            callback(m);
          },
          error: function (err) {
            console.log(err);
          }
        });
      },
      unsubscribe: function (channelId) {
        pubnub.unsubscribe({
          channel: channelId,
        });
      },
      getAll: function () {
        return notifications;
      }
    }
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