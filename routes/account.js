'use strict';

module.exports = function () {

  // DEPENDENCIES

  var express = require('express')
    , auth = require('../controllers/authentication')
		, routesHlp = require('../helpers/routes')
		, errCfg = require('../config/errors');


	var router = express.Router({mergeParams: true});


	// ROUTES

	// Sign-In API request.
	router.post('/api/signIn', function (req, res) {
		var email = req.body.email
			, password = req.body.password;

		auth.signIn(email, password)
			.then(function (session) {
				if (session)
					routesHlp.sendResponse(res, 200, null, null, session);
				else {
					var resErr = errCfg.credentialsError;
					routesHlp.sendResponse(res, resErr.code, resErr.data, resErr.options,
						null);
				}
			})
			.catch(function (err) {
				console.log(err);
				var resErr = errCfg.serverError;
				routesHlp.sendResponse(res, resErr.code, resErr.data, resErr.options,
					null);
			});
	});

  return router;
};
