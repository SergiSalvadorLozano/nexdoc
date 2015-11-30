'use strict';


// DEPENDENCIES

var _ = require('underscore')
  , express = require('express')
  , auth = require('../controllers/authentication')
  , sessionCtrl = require('../controllers/session')
  , userCtrl = require('../controllers/user')
  , routesHlp = require('../helpers/routes')
  ;


var router = express.Router({mergeParams: true});


// API ROUTES

var routes = {

  // POST
  'post': [
    // Sign Up.
    {
      url: '/signUp',
      mw: [],
      behaviour: function (req, res) {
        var values = req.body.user || {};

        return Promise.resolve()
          .then(function () {
            return auth.signUp(userCtrl.filterInput(values, {add: true}));
          })
          .then(function (session) {
            if (session) {
              routesHlp.sendResponse(res, 200, null, null,
                sessionCtrl.filterOutput(session, {firstResponse: true}));
            }
            else {
              throw _.extend(new Error(), {name: 'credentialsError'});
            }
          });
      }
    },

    // Sign In.
    {
      url: '/signIn',
      mw: [],
      behaviour: function (req, res) {
        var email = req.body.email || null
          , password = req.body.password || null
          , remember = !!req.body.remember
          ;

        return auth.signIn(email, password, remember)
          .then(function (session) {
            if (session) {
              routesHlp.sendResponse(res, 200, null, null,
                sessionCtrl.filterOutput(session, {firstResponse: true}));
            }
            else {
              throw _.extend(new Error(), {name: 'credentialsError'});
            }
          });
      }
    }
  ],

  //DELETE
  'delete': [

    // Sign Out.
    {
      url: '/signOut',
      mw: [auth.middleware()],
      behaviour: function (req, res) {
        return auth.signOut(req.session.refreshToken)
          .then(function () {
            routesHlp.sendResponse(res, 200, null, null, null);
          });
      }
    }
  ]
};


routesHlp.addRoutes(router, routes);

module.exports = router;
