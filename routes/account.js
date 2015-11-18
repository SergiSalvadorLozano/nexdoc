'use strict';


// DEPENDENCIES

var _ = require('underscore')
  , express = require('express')
  , auth = require('../controllers/authentication')
  , routesHlp = require('../helpers/routes')
  ;


var router = express.Router({mergeParams: true});


// ROUTES

var routes = {

  // POST
  post: [

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
              routesHlp.sendResponse(res, 200, null, null, session);
            }
            else {
              throw _.extend(new Error(), {name: 'credentialsError'});
            }
          });
      }
    },

    // Sign Out.
    {
      url: '/signOut',
      mw: [auth.middleware()],
      behaviour: function (req, res) {
        return auth.signOut(req.session.id)
          .then(function () {
              routesHlp.sendResponse(res, 200, null, null, null);
          });
      }
    }

  ]
};


routesHlp.addRoutes(router, routes);

module.exports = router;
