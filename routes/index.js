var express = require('express');
var router = express.Router();
var session = require('express-session');
var request = require('request');

var credentials = require('../credentials');
var config = require('../config');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/loginAutodesk', function (req, res, next) {

  var path = config.getADSKAuthPath() + '?client_id=' + credentials.AUTH_CLIENT_ID + '&response_type=code&redirect_uri=' + encodeURIComponent(credentials.AUTH_REDIRECT_URI) + '&scope=data:read';
  res.redirect(path);
});

router.get('/authorization', function (req, res, next) {

  var options = {
    'client_id': credentials.AUTH_CLIENT_ID,
    'client_secret': credentials.AUTH_CLIENT_SECRET,
    'grant_type': 'authorization_code',
    'redirect_uri': credentials.AUTH_REDIRECT_URI,
    'code': req.query.code
  };

  request({
    url: 'https://developer.api.autodesk.com/authentication/v1/gettoken', //URL to hit
    //qs: , //Query string data
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: options//Set the body as a string
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      if (response.statusCode === 200) {
        var token = JSON.parse(response.body).access_token;
        request({
          url: 'https://developer.api.autodesk.com/userprofile/v1/users/@me',
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }, function (error2, response2, body2) {
          if (error2) {
            console.log(error2);
          } else {
            if (response2.statusCode === 200) {
              setSessionUser(req, res, JSON.parse(response2.body).userName);
            }
          }
        });

      }
    }
  });

});

var setSessionUser = function (req, res, username) {
  req.session.regenerate(function () {
    req.session.user = username;
    res.redirect('/');
  });
}

module.exports = router;
