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
    , permCfg = require('../config/permissions');


  // PRIVATE ATTRIBUTES

  // Error returned when the credentials sent in the request are invalid.
  var credentialsError = {
    code: 401,
    data: { msg: 'Invalid credentials provided in request.' },
    options: {}
  };


  // Error returned when the idToken sent in the request is invalid.
  var sessionError = {
    code: 401,
    data: { msg: 'Request is using an invalid session.' },
    options: {}
  };


  // Error returned when an internal error happened during .
  var serverError = {
    code: 500,
    data: { msg: 'Server error during authentication.' },
    options: {}
  };


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
      error: {
        code: 403,
        data: { msg: 'User identity mismatch.' },
        options: {}
      }
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
      error: {
        code: 403,
        data: { msg: 'Insufficient permissions for request.' },
        options: {}
      }
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


	//
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
    resErr = resErr ? resErr : null;

    return function (req, res, next) {
      var idToken = req[idTokenLoc.prop][idTokenLoc.param];
      sessionCtrl.findOne({id_token: idToken})
        .then(function (session) {
          if (session && session.User && _validateSession(session)) {
            req.session = session;
            return _resolveCheckLists(req, checkLists);
          }
          else
            return Promise.resolve({verdict: false, resErr: sessionError});
        })
        .then(function (result) {
          if (result.verdict)
            next();
          else {
						var error = _mergeErrors(resErr, result.resErr);
						routesHlp.sendResponse(res, error.code, error.data, error.options);
					}
        })
        .catch(function (err) {
          console.log(err);
					var error = _mergeErrors(resErr, serverError);
					routesHlp.sendResponse(res, error.code, error.data, error.options);
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












  var next = function () {
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

  var req = {
    headers: {
      'nd-authentication': '46sad4fasdf6asd5fafas6df'
    },
    params: {userId: 2}
  };

  var cls = [
    [{name: 'permission', args: ['ProfileViewOwn']},
      {name: 'identity'}],
    [{name: 'permission', args: ['ProfileViewAll']}]
  ];

  auth.authMiddleware(cls)(req, res, next);


	auth.signIn('alice@example.com', '1234')
		.then(function (val) {
			console.log(val);
		})
		.catch(function (err) {
			console.log(err);
		})





  return auth;
}();
