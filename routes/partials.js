'use strict';

module.exports = function () {
  var router = express.Router({mergeParams: true});

  // DEPENDENCIES

  var express = require('express')
    , auth = require('../controllers/authentication')


  // ROUTES

  // Home partials.
  router.get('/home/index', function (req, res){
    res.render('partials/home/index');
  });

  return router;
};
