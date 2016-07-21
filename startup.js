var fs = require('fs');
var database = require('./database/database.js');
var credentials = require('./credentials.js');
var request = require('request');
var Promise = require('bluebird');

exports.initializeDatabase = function () {
  var path = './database/storage/channels.txt';

  if (!fs.statSync(path).isFile()) {
    database.saveDatabase(function () {
      //todo
    });
  }
}

function attachToken(xhr) {
  xhr.setRequestHeader("Authorization", 'Bearer ' + accessToken);
}





var accessToken;

function getToken() {

  var url = 'https://developer-stg.api.autodesk.com/authentication/v1/authenticate';
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
      return resolve;
    }
  });

}


function checkChannel(channelName, callback) {

  //$http.get(tokenUrl)
  getToken()
    .then(function (data) {
      accessToken = data;
      var url = 'https://developer-stg.api.autodesk.com/notifications/v1/channel/' + channelName;
      request.get({
        url: url,
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'text/json'
        }
      },
        function (error, response, body) {
          if (response.statusCode === 404) {
            createChannel(channelName, accessToken);
          } else {
            //channel exists - ok
            var channelId = JSON.parse(body).Channel;
            
            //deleteChannel(channelName, accessToken);
          }
        }
      );
    });
};




function createChannel(channelName, token) {

  var url = 'https://developer-stg.api.autodesk.com/notifications/v1/channel';

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

        } else {

          response.statusCode = 200;
        }
      }
    }
  );
};




function deleteChannel(channelName, token) {
  var url = 'https://developer-stg.api.autodesk.com/notifications/v1/channel' + channelName;

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




exports.gettoken = getToken;

exports.checkchannel = checkChannel;

exports.deletechannel = deleteChannel;