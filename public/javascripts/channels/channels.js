angular.module('fussball.scheduler.channels', [])

  .controller('ChannelsController', function ($mdMedia, $mdToast, $mdDialog, $http, $scope, channels, Channels, notifications, Notifications) {
    $scope.currentNavItem = 'page1';
    console.log('Hello from channels controller');
    $scope.channels = channels;
    $scope.notifications = notifications;

    for (var i = 0; i < channels.length; i++) {
      if (channels[i].subscribed) {
        var id = channels[i].id;
        var cb = function (m) {
          $scope.subscribeCallback(m, id);
        };
        Notifications.subscribe(channels[i].id, cb);
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
          data: { channelId: channel.id, timeout: result }
        })
          .then(function (resp) {
            channel.eventInProgress = true;
            channel.joined = true;
          });
      });
    };
    $scope.joinEvent = function (channel) {
      if (!channel) {
        channel = this.channel;
      }
      console.log("Join event", channel.name);
      $http({
        method: 'POST',
        url: '/api/channel/joinevent',
        data: { channelId: channel.id }
      })
        .then(function (resp) {
          channel.joined = true;
        });
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
      console.log("notification!");
      $http({
        method: 'POST',
        url: '/api/notification/decryp',
        data: { message: m }
      })
        .then(function (resp) {
          var m = resp.data.message[0];
          if (m.type === 'HAPPENS') {
            var users = m.eventUsers;
            Channels.onEventHappens(channelId,  function (channel, displayNotification) {
              if (displayNotification) {
                var textContent = "Event is happening! Go join your friends";
                var actionName = "Go!";
                $scope.showStartDialog(channel, textContent, actionName, users);
              }
            });
          } else if (m.type === 'CANCELLED') {
            Channels.onEventCanceled(channelId, function (channel, displayNotification) {
              if (displayNotification) {
                var textContent = "Event is not happening :(";
                var actionName = "Close";
                $scope.showStartDialog(channel, textContent, actionName);
              }
            });
          } else if (m.type === 'START') {
            Channels.onEventStarted(channelId, function (channel, displayNotification) {
              if (displayNotification) {
                $scope.displayToast(channel.name + " started!", "JOIN", function () {
                  $scope.joinEvent(channel);
                });
              }

            });
          }
        });
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
    $scope.showStartDialog = function (channel, textContent, actionName, users) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      var locals = {
        channel: channel,
        textContent: textContent,
        actionName: actionName,
        users : users
      }
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'javascripts/channels/dialog.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        fullscreen: useFullScreen,
        locals: locals
      })
        .then(function () {
          console.log("GO");
        });
      $scope.$watch(function () {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function (wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };


  })

  .directive('channel', function () {
    return {
      templateUrl: 'javascripts/channels/channel.html'
    };
  })
  .factory('Notifications', function () {
    var notifications = [];
    var userData = JSON.parse(localStorage.getItem('fussball.scheduler'));
    var pubnub = PUBNUB({
      subscribe_key: userData.subscribeKey,
      ssl: true
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
            console.log("Event started: ", channels[i].name);
            callback(channels[i], !channels[i].joined);
          }
        }
      },
      onEventCanceled: function (channelId, callback) {
        for (var i = 0; i < channels.length; i++) {
          if (channels[i].id === channelId) {
            channels[i].eventInProgress = false;
            var displayNotification = channels[i].joined;
            channels[i].joined = false;
            console.log("Event canceled: ", channels[i].name);
            callback(channels[i], displayNotification);
          }
        }
      },
      onEventHappens: function (channelId, callback) {
        for (var i = 0; i < channels.length; i++) {
          if (channels[i].id === channelId) {
            channels[i].eventInProgress = false;
            var displayNotification = channels[i].joined;
            channels[i].joined = false;
            console.log("Event it happening: ", channels[i].name);
            callback(channels[i], displayNotification);
          }
        }
      }
    };
  });

function DialogController($scope, $mdDialog, channel, textContent, actionName, users) {
  $scope.users = users? users : [];
  $scope.channel = channel;
  $scope.textContent = textContent;
  $scope.actionName = actionName;
  $scope.go = function () {
    $mdDialog.hide();
  };
}