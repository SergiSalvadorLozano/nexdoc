'use strict';

module.exports = function (){
  var auth = {};


  // DEPENDENCIES

  var _ = require('underscore')
    , Promise = require('bluebird')
		, bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))
    , sessionCtrl = require('./session')
    , userCtrl = require('./user')
    , commonHlp = require('../helpers/common')
    , routesHlp = require('../helpers/routes')
    , permCfg = require('../config/permissions')
		, errCfg = require('../config/errors');


  // PRIVATE ATTRIBUTES


  // Custom authentication checks
  var checks = {

    // Verifies that the requesting user has the given id.
    identity: {
      method: function (userIdLoc) {
        if (typeof userIdLoc === 'undefined')
          userIdLoc = {
            prop: 'params',
            param: 'userId'
          };
        return function (req) {
          return new Promise (function (resolve) {
            resolve(req.session.User.id ===
							req[userIdLoc.prop][userIdLoc.param]);
          });
        };
      },
      error: errCfg.identityError
    },

    // Verifies that the requesting user has the given permission.
    permission: {
      method: function (permReq) {
        return function (req) {
          return new Promise (function (resolve) {
            var perms = permCfg.permissions[req.session.User.role];
            resolve(perms.indexOf(permReq) >= 0);
          });
        };
      },
      error: errCfg.permissionsError
    }

    // Add more custom checks here.
  };


  // LOCAL HELPERS

	// Generates a new pair hash + salt from a password.
	var _hashPassword = function (password) {
		return bcrypt.genSaltAsync(10)
			.then(function(result) {
				return bcrypt.hashAsync(password, result, null);
			})
	};


  // Verifies the validity of a given session against a hash + salt pair.
	var _validatePassword = function (password, hash) {
		return bcrypt.compareAsync(password, hash);
	};


  // Verifies the validity of a given session.
  var _validateSession = function (session) {
    return session.expiry_date >= new Date();
  };


  // Extends the validity period of a given session.
  var _extendSession = function (session) {
    return sessionCtrl.updateOne(session, {expiry_date: commonHlp.soon(30)});
  };


  // Merges two error objects through Union. First objects takes precedence.
  var _mergeErrors = function (error1, error2) {
    return {
      code: !_.isUndefined(error1.code) ? error1.code : error2.code,
      data: !_.isUndefined(error1.data) ? _.extend(error2.data, error1.data)
        : error2.data,
      options: !_.isUndefined(error1.options) ?
        _.extend(error2.options, error1.options) : error2.options
    };
  };


  // Resolves a checklist.
  // Returned promise resolves to an object {verdict: boolean, resErr: object}.
  // - verdict is true only if no checks resolve to false.
  // - resErr is the error produced by the first check to fail, or undefined.
  var _resolveCheckList = function (req, checkList) {
    return new Promise (function (resolve, reject) {
      if (checkList.length <= 0)
        resolve({verdict: true});
      else {
        var check = checks[checkList[0].name];
        check.method.apply(null, checkList[0].args)(req)
          .then(function (verdict) {
            if (verdict)
              _resolveCheckList(req, checkList.slice(1))
                .then(function (result) {
                  resolve(result);
                })
                .catch(commonHlp.rejectPromise(reject));
            else
              resolve({verdict: false, resErr: check.error});
          })
          .catch(commonHlp.rejectPromise(reject));
      }
    });
  };


  // Resolves a list of checklists.
  // Returned promise resolves to an object {verdict: boolean, resErr: object}.
  // - verdict is true if at least one checklist has a true verdict.
  // - resErr is the error given by parameter. If undefined, it is the error
  //  produced by the first checklist to fail. Undefined for true verdicts.
  var _resolveCheckLists = function (req, checkLists, firstResErr) {
    return new Promise (function (resolve, reject) {
      if (checkLists.length === 0)
        resolve({verdict: false, resErr: firstResErr});
      else {
        _resolveCheckList(req, checkLists[0])
          .then(function (result) {
            if (result.verdict)
              resolve(result);
            else {
              var resErr = firstResErr ? firstResErr : result.resErr;
              _resolveCheckLists(req, checkLists.slice(1), resErr)
                .then(function (result) {
                  resolve(result);
                })
                .catch(commonHlp.rejectPromise(reject));
            }
          })
          .catch(commonHlp.rejectPromise(reject));
      }
    });
  };


  // FUNCTIONALITY

  //
  auth.authMiddleware = function (checkLists, idTokenLoc, resErr){

    checkLists = checkLists && checkLists.length > 0 ? checkLists : [[]];
    if (!idTokenLoc)
      idTokenLoc = {
        prop: 'headers',
        param: 'nd-authentication'
      };
    resErr = resErr ? resErr : {};

    return function (req, res, next) {
      var idToken = req[idTokenLoc.prop][idTokenLoc.param];
			req.session = null;

      sessionCtrl.findOne({id_token: idToken})
        .then(function (session) {
          if (session && session.User && _validateSession(session))
            return _extendSession(session);
          else
            return Promise.resolve({verdict: false,
							resErr: errCfg.sessionError});
        })
        .then(function (session) {
          if (session) {
            req.session = session;
            return _resolveCheckLists(req, checkLists);
          }
          else
            return Promise.resolve({verdict: false,
							resErr: errCfg.sessionError});
        })
        .then(function (result) {
          if (result.verdict)
            next();
          else {
						var error = _mergeErrors(resErr, result.resErr);
						routesHlp.sendResponse(res, error.code, error.data, error.options,
							req.session);
					}
        })
        .catch(function (err) {
          console.log(err);
					var error = _mergeErrors(resErr, errCfg.serverError);
					routesHlp.sendResponse(res, error.code, error.data, error.options,
						req.session);
        });
    };
  };


	//
	auth.signIn = function (email, password) {
		var user;
		return userCtrl.findOne({email: email})
			.then(function (userPar) {
				user = userPar;
				if (user)
					return _validatePassword(password, user.password);
			})
			.then(function (verdict) {
				if (verdict)
					return sessionCtrl.createOne(user);
			})
	};


  //
  auth.signOut = function (sessionId) {
		return sessionCtrl.deleteOne({id: sessionId});
	};


  /*var next = function () {
    console.log('PASSED THE TESTS!')
  };

  var res = {
    status: function (code) {
      console.log('ERROR CODE: ' + code);
      return this;
    },
    json: function (err) {
      console.log('ERROR DATA: ' + err.data.msg);
    }
  };

  var cls = [
    [{name: 'permission', args: ['ProfileViewOwn']},
      {name: 'identity'}],
    [{name: 'permission', args: ['ProfileViewAll']}]
  ];

	auth.signIn('bob@example.com', '4321')
		.then(function (session) {
      if (!session)
        throw new Error('Invalid session!')
      var req = {
        headers: {'nd-authentication': session.id_token},
        params: {userId: 2}
      };
      auth.authMiddleware(cls)(req, res, next);
		})
		.catch(function (err) {
			console.log(err);
		})*/

  return auth;
}();
