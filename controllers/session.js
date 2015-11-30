'use strict';


// Mock controller. Modify ASAP.
var sessionCtrl = {};

var _ = require('underscore')
  , Promise = require('bluebird')
  , userCtrl = require('./user')
  , constants = require('../config/constants')
  , commonHlp = require('../helpers/common')
  , models = require('../models')
  ;


// HELPERS

// Builds the 'match' part of a Sequelize query according to the given flags.
var _buildQueryMatch = function (where, flags) {
  var match = {
    where: where,
    include: [{model: models.User}]
  };
  return match;
};


// FUNCTIONALITY

// Filters an output object so it will only contain values for certain keys.
sessionCtrl.filterOutput = function (sessionValues, flags) {
  var allowed = ['User', 'languageCode', 'refreshExpiryDate'];

  if (flags.firstResponse) {
    allowed = _.union(allowed, ['refreshToken', 'accessExpiryDate',
      'accessToken']);
  }
  if (flags.refresh) {
    allowed = _.union(allowed, ['accessExpiryDate', 'accessToken']);
  }

  sessionValues.User = userCtrl.filterOutput(sessionValues.User,
    {session: true});

  return _.pick(sessionValues, allowed);
};


// Verifies the validity of a given session.
sessionCtrl.validateSession = function (session, refresh) {
  if (refresh) {
    return !session.refreshExpiryDate ||
      new Date(session.refreshExpiryDate) >= new Date()
  }
  else {
    return !session.accessExpiryDate ||
      new Date(session.accessExpiryDate) >= new Date()
  }
};


// Extends the validity period of a session (identified by its refreshToken).
// Optionally, also refreshes the access token and its expiry date.
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
  return sessionCtrl.update({refreshToken: session.refreshToken}, newValues)
    .then(function () {
      return sessionCtrl.findOne({refreshToken: session.refreshToken});
    });
};


sessionCtrl.findOne = function (where, flags, fullInstance) {
  var match = _buildQueryMatch(where, flags);

  return models.Session.findOne(match)
    .then(function (session) {
      return fullInstance ? session : JSON.parse(JSON.stringify(session));
    });
};


sessionCtrl.createOne = function (user, remember, fullInstance) {
  var values = {
    userId: user.id,
    languageCode: user.languageCode
  };
  if (remember) {
    values.refreshExpiryDate = null;
  }

  return models.Session.create(values)
    .then(function (session) {
      return sessionCtrl.findOne({refreshToken: session.get('refreshToken')},
        null, fullInstance);
    });
};


sessionCtrl.update = function (where, newValues) {
  return models.Session.update(newValues, {where: where});
};


sessionCtrl.delete = function (where) {
  return models.Session.destroy({where: where});
};


module.exports = sessionCtrl;
