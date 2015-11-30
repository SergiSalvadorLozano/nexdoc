'use strict';


// Mock controller. Modify ASAP.
var userCtrl = {};

var _ = require('underscore')
  , Promise = require('bluebird')
  , models = require('../models')
  ;


// HELPERS

// Builds the 'match' part of a Sequelize query according to the given flags.
var _buildQueryMatch = function (where, flags) {
  var match = {where: where};
  return match;
};


// FUNCTIONALITY

// Filters an input object so it will only contain values for certain keys.
// Throws an error if any of the required keys are not present.
userCtrl.filterInput = function (values, flags) {
  var optional = []
    , required = []
    ;

  if (flags.add) {
    required = _.union(required, ['email', 'name', 'password']);
  }
  if (flags.edit) {
    optional = _.union(optional, ['name']);
  }

  if (_.difference(required, _.keys(values)).length > 0) {
    throw _.extend(new Error, {name: 'requiredInputError'});
  }
  return _.pick(values, _.union(required, optional));
};


// Filters an output object so it will only contain values for certain keys.
userCtrl.filterOutput = function (user, flags) {
  var allowed = ['id', 'name'];
  if (flags.session) {
    allowed = _.union(allowed, ['role']);
  }
  return _.pick(user, allowed);
};


userCtrl.createOne = function (values) {
  return models.User.create(values)
    .then(function (user) {
      return user.get();
    });
};


userCtrl.findOne = function (where, flags, fullInstance) {
  var match = _buildQueryMatch(where, flags);

  return models.User.findOne(match)
    .then(function (user) {
      return fullInstance ? session : JSON.parse(JSON.stringify(user));
    });
};


userCtrl.update = function (where, newValues) {
  return models.User.update(newValues, {where: where});
};


userCtrl.delete = function (where) {
  return models.User.destroy({where: where});
};


module.exports = userCtrl;
