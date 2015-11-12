'use strict';


// DEPENDENCIES

var _ = require('underscore')
  , Promise = require('bluebird')
  , permCfg = require('../config/permissions')
  ;



// CUSTOM AUTHENTICATION CHECKS

var authChecks = {

  // Verifies that the requesting user has the given id.
  identity: {
    method: function (userIdLoc) {
      userIdLoc = userIdLoc || {
          prop: 'params',
          param: 'userId'
        };
      return function (req) {
        return new Promise(function (resolve) {
          var expectedUserId = parseInt(req[userIdLoc.prop][userIdLoc.param]);
          resolve(req.session.User.id === expectedUserId);
        });
      };
    },
    error: 'identityError'
  },

  // Verifies that the requesting user has the given permission.
  permission: {
    method: function (permReq) {
      return function (req) {
        return new Promise(function (resolve) {
          var perms = permCfg.permissions[req.session.User.role];
          resolve(perms.indexOf(permReq) >= 0);
        });
      };
    },
    error: 'permissionsError'
  }

  // Add more custom checks here.
};


module.exports = authChecks;
