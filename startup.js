var fs = require('fs');
var database = require('./database/database.js');
var credentials = require('./credentials.js');
var request = require('request');
var Promise = require('bluebird');
var config = require('./config.js')



function attachToken(xhr) {
  xhr.setRequestHeader("Authorization", 'Bearer ' + accessToken);
}



var accessToken;

function getToken() {

  var url = config.getADSKAuthenticatePath();
  var token;

  return new Promise(function (resolve, reject) {
    request.post({
      url: url,
      form: {
        client_id: credentials.CLIENT_ID,
        client_secret: credentials.CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'data:read'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
      function (error, response, body) {
        if (error) {
          response.sendStatus(400);
        } else {
          response.status = 200;
          token = JSON.parse(body).access_token;
          //response.send(JSON.parse(body).access_token);
          resolve(token);
        }
      }
    );
  }).then(function (resolve, reject) {
    if (resolve) {
      global.token = resolve;
      return resolve;
    }
  });

}


function checkChannel(channelName, maxUsers) {

  //$http.get(tokenUrl)
  getToken()
    .then(function (data) {
      accessToken = data;
      var url = config.getADSKChannelPath() + '/' + channelName;
      request.get({
        url: url,
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'text/json'
        }
      },
        function (error, response, body) {
          if (response.statusCode === 404) {
            createChannel(channelName, maxUsers, accessToken);
          } else {
            //channel exists - ok, maybe update needed...
            var channelId = JSON.parse(body).Channel;
            database.createChannel(channelId, channelName, maxUsers);
          }
        }
      );
    });
};


function createChannel(channelName, maxUsers, token) {

  var url = config.getADSKChannelPath();

  var data = JSON.stringify({
    channelName: channelName,
    channelType: 'BROADCAST'
  });

  request.post({
    url: url,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: data
  },
    function (error, response, body) {
      if (error) {
        response.statusCode = 400;
      } else {
        if (response.statusCode === 409) {
          //already exists
        } else {
          response.statusCode = 200;
          var channelId = body.channelId;
          database.createChannel(channelId, channelName, maxUsers);
        }
      }
    }
  );
};


function deleteChannel(channelName, token) {
  var url = config.getADSKChannelPath() + channelName;

  request.delete({
    url: url,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Access-Control-Allow-Origin': '*'
    },
  },
    function (error, response, body) {
      if (error) {
        response.statusCode = 400;
      } else {
        response.statusCode = 200;
      }
    }
  );
};



exports.GetToken = getToken;

exports.CheckChannel = checkChannel;
