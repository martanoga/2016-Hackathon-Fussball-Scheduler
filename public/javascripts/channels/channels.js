angular.module('fussball.scheduler.channels', [])

  .controller('ChannelsController', function ($mdToast, $mdDialog, $http, $scope, channels, Channels, notifications, Notifications) {
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
            return 'green';
          }
          return 'orange';
        }
        return 'default';
      }
      return 'grey';
    }
    $scope.subscribe = function () {
      console.log("Subscribe!", this.channel.name);
      var channel = this.channel;
      $http({
        method: 'POST',
        url: '/api/channels/join',
        data: { channelId: channel.id }
      })
        .then(function (resp) {
          channel.subscribed = true;
          Notifications.subscribe(channel.id, function (m) {
            $scope.subscribeCallback(m, channel.id);
          });
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
    $scope.startEvent = function (ev) {
      console.log("Start event", this.channel.name);
      var channel = this.channel;
      var confirm = $mdDialog.prompt()
        .title('Do you really want to start an event?')
        .textContent('How long would you like to wait for other users to join your event?')
        .placeholder('Subscription timeout')
        .ariaLabel('Subscription timeout')
        .initialValue('15')
        .targetEvent(ev)
        .ok('Start!')
        .cancel('Maybe not...');
      $mdDialog.show(confirm).then(function (result) {
        $http({
          method: 'POST',
          url: '/api/channel/startevent',
          data: { channelId: channel.id, timeout: result, maxUSer: 15 }
        })
          .then(function (resp) {
            channel.eventInProgress = true;
          });
      });
    };
    $scope.joinEvent = function (channel) {
      if (!channel) {
        channel = this.channel;
      }
      console.log("Join event", channel.name);
      //TBD: post to server
      //this should be done in callabck
      channel.joined = true;
    };

    $scope.cancelEvent = function () {
      $scope.subscribeCallback({ type: "CANCEL" }, $scope.channels[0].id);
    }
    $scope.makeEventHappen = function () {
      $scope.subscribeCallback({ type: "HAPPEN" }, $scope.channels[0].id);
    }

    $scope.startEventFake = function () {
      $scope.subscribeCallback({ type: "START" }, $scope.channels[0].id);
    }

    $scope.subscribeCallback = function (m, channelId) {
      if (m.type === 'HAPPEN') {
        Channels.onEventHappens(channelId, function (channel) {
          $scope.displayToast(channel.name + " is happening!");
        });
      } else if (m.type === 'CANCEL') {
        Channels.onEventCanceled(channelId, function (channel) {
          $scope.displayToast(channel.name + " is canceled!");
        });
      } else if (m.type === 'START') {
        Channels.onEventStarted(channelId, function (channel) {
          $scope.displayToast(channel.name + " started!", "JOIN", function () {
            $scope.joinEvent(channel);
          });
        });
      }
    }

    $scope.displayToast = function (message, action, callback) {
      var toast = $mdToast.simple().textContent(message).position('bottom right');
      if (action) {
        toast.action(action);
      }
      $mdToast.show(toast).then(function (response) {
        if (response && callback) {
          callback(response);
        };
      });
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
  .factory('Channels', function ($http, $location) {
    var channels = [];
    return {
      getAll: function () {
        return $http({
          method: 'GET',
          url: '/api/channels'
        })
          .then(function (resp) {
            channels = resp.data
            return channels;
          })
          .catch(function (err) {
            console.log(err);
            if (err.status === 401) {
              $location.path("signout");
            }

          });

      },
      onEventStarted: function (channelId, callback) {
        for (var i = 0; i < channels.length; i++) {
          if (channels[i].id === channelId) {
            channels[i].eventInProgress = true;
            channels[i].joined = false;
            console.log("Event started: ", channels[i].name);
            callback(channels[i]);
          }
        }
      },
      onEventCanceled: function (channelId, callback) {
        for (var i = 0; i < channels.length; i++) {
          if (channels[i].id === channelId) {
            channels[i].eventInProgress = false;
            channels[i].joined = false;
            console.log("Event canceled: ", channels[i].name);
            callback(channels[i]);
          }
        }
      },
      onEventHappens: function (channelId, callback) {
        for (var i = 0; i < channels.length; i++) {
          if (channels[i].id === channelId) {
            channels[i].eventInProgress = false;
            channels[i].joined = false;
            console.log("Event it happening: ", channels[i].name);
            callback(channels[i]);
          }
        }
      }
    };
  });