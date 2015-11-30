'use strict';


// DEPENDENCIES

var _ = require('underscore')
  , express = require('express')
  , userCtrl = require('../controllers/user')
  , routesHlp = require('../helpers/routes')
  ;


var router = express.Router({mergeParams: true});


// ROUTES

var routes = {

  // GET
  'get': [

  ],

  // PUT
  'put': [

  ],

  // POST
  'post': [

  ],

  //DELETE
  'delete': [

  ]
};


routesHlp.addRoutes(router, routes);

module.exports = router;
