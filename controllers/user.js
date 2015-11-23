'use strict';


// Mock controller. Modify ASAP.
var userCtrl = {};

var _ = require('underscore')
  , Promise = require('bluebird')
  , ctrlHlp = require('../helpers/controllers')
  ;


// FUNCTIONALITY

// Filters a user object so it will only contain values for certain keys.
userCtrl.filter = function (userValues, flags) {
  var whiteList = ['id', 'name'];
  if (flags.session) {
    whiteList = whiteList.concat(['role']);
  }
  return _.pick(userValues, whiteList);
};


userCtrl.createOne = function (values) {

};


userCtrl.findOne = function (where, include) {
  return ctrlHlp.findOne('User', where, include);
};


userCtrl.updateOne = function (model, newValues) {
  return ctrlHlp.updateOne(model, newValues);
};


userCtrl.updateAll = function (where, newValues) {
  return ctrlHlp.updateAll('User', where, newValues);
};


module.exports = userCtrl;
