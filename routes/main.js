'use strict';


// DEPENDENCIES

var express = require('express')
  , Promise = require('bluebird')
  , auth = require('../controllers/authentication')

  // Subrouters.
  , partialsRouter = require('./partials')
  , accountRouter = require('./account')
  ;


var router = express.Router({mergeParams: true});


// ROUTES

// Rendering of partial views.
router.use('/partials', partialsRouter);

// Account API requests.
router.use('/api/account', accountRouter);


// Rendering of the common layout. Other view routing is delegated to
// client-side code.
router.get('/*', function (req, res) {
  res.render('common');
});


module.exports = router;