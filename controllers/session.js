'use strict';

// Mock controller. Modify ASAP.
module.exports = function (){
  var sessionCtrl = {};

  var Promise = require('bluebird')
		, commonHlp = require('../helpers/common')
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

	sessionCtrl.createOne = function (user) {
		var newValues = {
			id: Math.floor(Math.random() * 1000),
			id_token: commonHlp.generateString(100),
			user_id: user.id,
			expiry_date: commonHlp.soon(30)
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


  return sessionCtrl;
}();
