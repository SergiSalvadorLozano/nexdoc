'use strict';


var errCfg = {

  // The server ran into an unexpected problem.
  serverError: {
    code: 500,
    data: {name: 'serverError'},
    options: {}
  },

  // The credentials sent in a sign-in request are invalid.
  credentialsError: {
    code: 403,
    data: {name: 'credentialsError'},
    options: {}
  },

  // An ID token is not present, is invalid or has expired.
  sessionError: {
    code: 401,
    data: {name: 'sessionError'},
    options: {}
  },

  // Request failed to provide one or more of the required input values.
  requiredInputError: {
    code: 403,
    data: {name: 'requiredInputError'},
    options: {}
  },

  // Requesting user's identity doesn't correspond with the one expected.
  identityError: {
    code: 403,
    data: {name: 'identityError'},
    options: {}
  },

  // User lacks the necessary permissions for the requested operation.
  permissionsError: {
    code: 403,
    data: {name: 'permissionsError'},
    options: {}
  }
};


module.exports = errCfg;