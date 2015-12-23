'use strict';


// DEPENDENCIES

var express = require('express')
  , auth = require('../controllers/authentication')
  ;

var router = express.Router({mergeParams: true});


// ROUTES

// Account partials.
router.get('/account/:name', function (req, res) {
  res.render('partials/account/' + req.params.name);
});


// Home partials.
router.get('/home/:name', function (req, res) {
  res.render('partials/home/' + req.params.name);
});


module.exports = router;
