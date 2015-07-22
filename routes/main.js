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
  router.post('/api/login', function (req, res) {
    Promise.resolve()
      .then(function () {
        if (req.body.username && req.body.password)
          return auth.signIn(req.body.username, req.body.password,
            !!req.body.permanence);
      })
      .then(function (user){
        if (user)
          res.status(200).json(user);
        else
          res.sendStatus(404);
      })
      .catch(function (err){
        console.log(err);
        res.sendStatus(404);
      })
  });

  // Rendering of the common layout. Routing is left to front-end.
  router.get('/*', function (req, res) {
    res.render('common');
  });


  return router;
};
