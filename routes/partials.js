'use strict';


// DEPENDENCIES

var express = require('express')
  , auth = require('../controllers/authentication')
  ;

var router = express.Router({mergeParams: true});


// ROUTES

//// Common partials.
//router.get('/common/:name', function (req, res) {
//  res.render('partials/common/' + req.params.name);
//});


// Resources partials.
router.get('/:category/:name', function (req, res) {
  res.render('partials/' + req.params.category + '/' + req.params.name);
});



module.exports = router;
