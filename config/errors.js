'use strict';

module.exports = function () {

	var errCfg = {};


	// Error returned when the server ran into an unexpected problem.
	errCfg.serverError = {
		code: 500,
		data: { msg: 'Server error while processing the request.' },
		options: {}
	};


	// The credentials sent in a sign-in request are invalid.
	errCfg.credentialsError = {
		code: 401,
		data: { msg: 'Invalid credentials provided in request.' },
		options: {}
	};


	// An ID token is not present, is invalid or has expired.
	errCfg.sessionError = {
		code: 401,
		data: { msg: 'Request is using an invalid session.' },
		options: {}
	};


	// User's identity doesn't correspond with the one expected.
	errCfg.identityError = {
		code: 403,
			data: { msg: 'User identity mismatch.' },
		options: {}
	};


	// User lacks the necessary permissions for the requested operation.
	errCfg.permissionsError = {
		code: 403,
		data: { msg: 'Insufficient permissions for request.' },
		options: {}
	};


	return errCfg;
}();