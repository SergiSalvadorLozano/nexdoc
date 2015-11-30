'use strict';


var errCfg = {

  // The server ran into an unexpected problem.
  serverError: {
    code: 500,
    data: {msg: 'Server error while processing the request.'},
    options: {}
  },

  // The credentials sent in a sign-in request are invalid.
  credentialsError: {
    code: 403,
    data: {msg: 'Invalid credentials provided in request.'},
    options: {}
  },

  // An ID token is not present, is invalid or has expired.
  sessionError: {
    code: 401,
    data: {msg: 'Request is using an invalid session.'},
    options: {}
  },

  // Request failed to provide one or more of the required input values.
  requiredInputError: {
    code: 403,
    data: {msg: 'Request is missing one or more required input values.'},
    options: {}
  },

  // Requesting user's identity doesn't correspond with the one expected.
  identityError: {
    code: 403,
    data: {msg: 'User identity mismatch.'},
    options: {}
  },

  // User lacks the necessary permissions for the requested operation.
  permissionsError: {
    code: 403,
    data: {msg: 'Insufficient permissions for request.'},
    options: {}
  }
};


module.exports = errCfg;