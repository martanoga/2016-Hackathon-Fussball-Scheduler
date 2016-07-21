var express = require('express');
var router = express.Router();
var request = require('request');

var credentials = require('../credentials');
var config = require('../config');
var database = require('../database/database.js');

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
    url: config.getADSKGetTokenPath(), //URL to hit
    //qs: , //Query string data
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: options//Set the body as a string
  }, function (error, response, body) {
    if (error) {
      console.log(error);
      res.status = 400;
      res.redirect('/loginAutodesk');
    } else {
      if (response.statusCode === 200) {
        var token = JSON.parse(response.body).access_token;
        request({
          url: config.getADSKGetUserInfoPath(),
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }, function (error2, response2, body2) {
          if (error2) {
            console.log(error2);
            res.status = 400;
            res.redirect('/loginAutodesk');
          } else {
            if (response2.statusCode === 200) {
              setSessionUser(req, res, token, JSON.parse(response2.body).userId); //JSON.parse(response2.body).userName
            }
          }
        });
      }
    }
  });

});

var setSessionUser = function (req, res, token, userId) {
  database.addUser(userId, token);
  res.status = 200;
  //res.json({token: token});
  res.redirect('/#/token/' + token + '/' + userId);
}

module.exports = router;
