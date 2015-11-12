'use strict';


// DEPENDENCIES

var express = require('express')
  , auth = require('../controllers/authentication')
  ;

var router = express.Router({mergeParams: true});


// ROUTES

// Home partials.
router.get('/home/index', function (req, res) {
  res.render('partials/home/index');
});

module.exports = router;
