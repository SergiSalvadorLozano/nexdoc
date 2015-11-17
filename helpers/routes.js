'use strict';


// DEPENDENCIES

var _ = require('underscore')
  , errCfg = require('../config/errors')
  ;


var routesHlp = {};


// FUNCTIONALITY

routesHlp.sendResponse = function (res, code, data, options, session) {
  res.status(code).json({data: data, options: options, session: session});
};


routesHlp.addRoutes = function (router, routes) {
  _.keys(routes).forEach(function (method) {
    routes[method].forEach(function (route) {
      var behaviour = function (req, res) {
        route.behaviour(req, res)
          .catch(function (err) {
            console.log(err);
            var resErr = errCfg[err.name] || errCfg.serverError;
            routesHlp.sendResponse(res, resErr.code, resErr.data,
              resErr.options, null);
          })
      };

      router[method].apply(router,
        [route.url].concat(route.mw).concat([behaviour]));
    });
  });
};


module.exports = routesHlp;
