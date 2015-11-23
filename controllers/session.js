'use strict';


// Mock controller. Modify ASAP.
var sessionCtrl = {};

var _ = require('underscore')
  , Promise = require('bluebird')
  , userCtrl = require('./user')
  , commonHlp = require('../helpers/common')
  , ctrlHlp = require('../helpers/controllers')
  ;


// CONSTANTS

const ACCESS_TOKEN_LENGTH = 175; // Digits in base 64.
const REFRESH_TOKEN_LENGTH = 350; // Digits in base 64.
const ACCESS_TOKEN_VALIDITY = 0.5; // Hours.
const REFRESH_TOKEN_VALIDITY = 24; // Hours.


// FUNCTIONALITY

// Filters a session object so it will only contain values for certain keys.
sessionCtrl.filter = function (sessionValues, flags) {
  var whiteList = ['User', 'lang_code', 'refresh_expiry_date'];
  if (flags.firstResponse) {
    whiteList.push('refresh_token');
  }
  if (flags.firstResponse || flags.refresh) {
    whiteList = whiteList.concat(['access_expiry_date', 'access_token']);
  }
  sessionValues.User = userCtrl.filter(sessionValues.User, {session: true});
  return _.pick(sessionValues, whiteList);
};


// Verifies the validity of a given session.
sessionCtrl.validateSession = function (session, refresh) {
  if (refresh) {
    return !session.refresh_expiry_date ||
      session.refresh_expiry_date >= new Date()
  }
  else {
    return !session.access_expiry_date ||
      session.access_expiry_date >= new Date()
  }
};


// Extends the validity period of a given session.
sessionCtrl.extendSession = function (session, refresh) {
  var newValues = {
    refresh_expiry_date: commonHlp.later(REFRESH_TOKEN_VALIDITY)
  };
  if (refresh) {
    newValues.access_token = commonHlp.generateString(ACCESS_TOKEN_LENGTH);
    newValues.access_expiry_date = commonHlp.later(ACCESS_TOKEN_VALIDITY);
  }
  return sessionCtrl.updateOne(session, newValues);
};


sessionCtrl.findOne = function (where, include) {
  return new Promise(function (resolve) {
    var session;
    ctrlHlp.findOne('Session', where, include)
      .then(function (sessionPar) {
        session = sessionPar;
        return session ? ctrlHlp.findOne('User', {id: session.user_id})
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
    refresh_token: commonHlp.generateString(REFRESH_TOKEN_LENGTH),
    access_token: commonHlp.generateString(ACCESS_TOKEN_LENGTH),
    user_id: user.id,
    lang_code: 'en',
    refresh_expiry_date: remember ? null
      : commonHlp.later(REFRESH_TOKEN_VALIDITY),
    access_expiry_date: commonHlp.later(ACCESS_TOKEN_VALIDITY)
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
