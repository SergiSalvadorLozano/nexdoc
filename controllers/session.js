'use strict';


// Mock controller. Modify ASAP.
var sessionCtrl = {};

var _ = require('underscore')
  , Promise = require('bluebird')
  , userCtrl = require('./user')
  , constants = require('../config/constants')
  , commonHlp = require('../helpers/common')
  , ctrlHlp = require('../helpers/controllers')
  ;


// CONSTANTS

//const ACCESS_TOKEN_LENGTH = 175; // Digits in base 64.
//const REFRESH_TOKEN_LENGTH = 350; // Digits in base 64.
//const ACCESS_TOKEN_VALIDITY = 0.5; // Hours.
//const REFRESH_TOKEN_VALIDITY = 24; // Hours.


// FUNCTIONALITY

// Filters a session object so it will only contain values for certain keys.
sessionCtrl.filterOutput = function (sessionValues, flags) {
  var whiteList = ['User', 'languageCode', 'refreshExpiryDate'];
  if (flags.firstResponse) {
    whiteList.push('refreshToken');
  }
  if (flags.firstResponse || flags.refresh) {
    whiteList = whiteList.concat(['accessExpiryDate', 'accessToken']);
  }
  sessionValues.User = userCtrl.filterOutput(sessionValues.User, {session: true});
  return _.pick(sessionValues, whiteList);
};


// Verifies the validity of a given session.
sessionCtrl.validateSession = function (session, refresh) {
  if (refresh) {
    return !session.refreshExpiryDate ||
      session.refreshExpiryDate >= new Date()
  }
  else {
    return !session.accessExpiryDate ||
      session.accessExpiryDate >= new Date()
  }
};


// Extends the validity period of a given session.
sessionCtrl.extendSession = function (session, refresh) {
  var newValues = {
    refreshExpiryDate: commonHlp.later(constants.REFRESH_TOKEN_VALIDITY)
  };
  if (refresh) {
    newValues.accessToken =
      commonHlp.generateString(constants.ACCESS_TOKEN_LENGTH);
    newValues.accessExpiryDate =
      commonHlp.later(constants.ACCESS_TOKEN_VALIDITY);
  }
  return sessionCtrl.updateOne(session, newValues);
};


sessionCtrl.findOne = function (where, include) {
  return new Promise(function (resolve) {
    var session;
    ctrlHlp.findOne('Session', where, include)
      .then(function (sessionPar) {
        session = sessionPar;
        return session ? ctrlHlp.findOne('User', {id: session.userId})
          : null;
      })
      .then(function (userPar) {
        if (session)
          session.User = userPar;
        resolve(session);
      })
  });
};


sessionCtrl.createOne = function (user, remember) {
  var newValues = {
    refreshToken: commonHlp.generateString(constants.REFRESH_TOKEN_LENGTH),
    accessToken: commonHlp.generateString(constants.ACCESS_TOKEN_LENGTH),
    userId: user.id,
    languageCode: 'en',
    refreshExpiryDate: remember ? null
      : commonHlp.later(constants.REFRESH_TOKEN_VALIDITY),
    accessExpiryDate: commonHlp.later(constants.ACCESS_TOKEN_VALIDITY)
  };
  return ctrlHlp.createOne('Session', newValues)
    .then(function (session) {
      if (session)
        session.User = user;
      return Promise.resolve(session);
    });
};


sessionCtrl.updateOne = function (model, newValues) {
  return ctrlHlp.updateOne(model, newValues);
};


sessionCtrl.updateAll = function (where, newValues) {
  return ctrlHlp.updateAll('Session', where, newValues);
};


sessionCtrl.deleteOne = function (where) {
  return ctrlHlp.deleteOne('Session', where);
};


module.exports = sessionCtrl;
