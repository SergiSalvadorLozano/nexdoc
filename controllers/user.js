'use strict';

// Mock controller. Modify ASAP.
module.exports = function (){
  var userCtrl = {};

  var Promise = require('bluebird')
    , ctrlHlp = require('../helpers/controllers');




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


  return userCtrl;
}();
