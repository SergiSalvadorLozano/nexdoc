'use strict';

// Mock controller. Modify ASAP.
module.exports = function (){
  var sessionCtrl = {};

  var Promise = require('bluebird')
    , ctrlHlp = require('../helpers/controllers');

  sessionCtrl.findOne = function (where, include) {
    return new Promise (function (resolve, reject) {
      var session;
      ctrlHlp.findOne('Session', where, include)
        .then(function (sessionPar) {
          session = sessionPar;
          return ctrlHlp.findOne('User', {id: session.user_id});
        })
        .then(function (userPar) {
          session.User = userPar;
          resolve(session);
        })
    });
  };

  sessionCtrl.updateOne = function (model, newValues) {
    return ctrlHlp.updateOne(model, newValues);
  };

  sessionCtrl.updateAll = function (where, newValues) {
    return ctrlHlp.updateAll('Session', where, newValues);
  };


  return sessionCtrl;
}();
