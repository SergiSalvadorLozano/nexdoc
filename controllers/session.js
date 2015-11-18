'use strict';


// Mock controller. Modify ASAP.
var sessionCtrl = {};

var Promise = require('bluebird')
  , commonHlp = require('../helpers/common')
  , ctrlHlp = require('../helpers/controllers');


sessionCtrl.ID_TOKEN_LENGTH = 175; // Digits in base 64.
sessionCtrl.REFRESH_TOKEN_LENGTH = 350; // Digits in base 64.
sessionCtrl.ID_TOKEN_VALIDITY = 0.5; // Hours.
sessionCtrl.REFRESH_TOKEN_VALIDITY = 24; // Hours.


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
    id: Math.floor(Math.random() * 1000),
    id_token: commonHlp.generateString(sessionCtrl.ID_TOKEN_LENGTH),
    refresh_token: commonHlp.generateString(sessionCtrl.REFRESH_TOKEN_LENGTH),
    user_id: user.id,
    lang_code: 'en',
    expiry_date: remember ? null
      : commonHlp.later(sessionCtrl.ID_TOKEN_VALIDITY),
    refresh_expiry_date: remember ? null
      : commonHlp.later(sessionCtrl.REFRESH_TOKEN_VALIDITY)
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
