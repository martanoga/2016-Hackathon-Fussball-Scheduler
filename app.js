var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require('./routes/api');
var router = require('./routes/index');
//var users = require('./routes/users');

var startup = require('./startup.js');

var app = express();

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);
app.use('/api', api);
//app.use('/users', users);

startup.CheckChannel('fussball', 4, 4);
startup.CheckChannel('pizza', 1, 100);

module.exports = app;
