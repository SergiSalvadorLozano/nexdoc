'use strict';

module.exports = function () {
  var router = express.Router({mergeParams: true});

  // DEPENDENCIES

  var express = require('express')
    , Promise = require('bluebird')
    , auth = require('../controllers/authentication')

  // Subrouters.
    , partialsRouter = require('./partials');


  // ROUTES

  // Rendering of partial views.
  router.use('/partials', partialsRouter);

  // Login API request.

  var authErrOptions = { '401': { bypassInterceptors: true } };
  var authMW = auth.authMiddleware(null, null, null, null, authErrOptions);
  router.post('/api/login', authMW, function (req, res) {
    res.status(200).json(req.user);
  });


  // Rendering of the common layout. Routing is left to front-end.
  router.get('/*', function (req, res) {
    res.render('common');
  });


  return router;
};
