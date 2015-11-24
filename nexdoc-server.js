'use strict';

var express = require('express')
  , bodyParser = require('body-parser')
  , path = require('path')
  , models = require('./models')
  , router = require('./routes/main')
  ;

var port = 3000;

var app = express();

// Global middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Directory shortcuts.
app.use(express.static(path.join(__dirname, 'client')));
app.use('/components', express.static(path.join(__dirname,
  'bower_components')));

// View engine.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Routes.
app.use('/', router);

models.sequelize.sync().then(function () {
  var server = app.listen(port, function () {
    console.log('Express server listening on port ' + port);
  });
});
