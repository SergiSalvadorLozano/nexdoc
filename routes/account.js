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

      fn: function (req, res) {
        var email = req.body.email
          , password = req.body.password;

        console.log(email);
        console.log(password);

        return auth.signIn(email, password)
          .then(function (session) {
            if (session) {
              routesHlp.sendResponse(res, 200, null, null, session);
            }
            else {
              throw _.extend(new Error(), {name: 'credentialsError'});
            }
          });
      }
    }

  ]
};



routesHlp.addRoutes(router, routes);

module.exports = router;
