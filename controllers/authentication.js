'use strict';


var auth = {};


// DEPENDENCIES

var _ = require('underscore')
  , Promise = require('bluebird')
  , bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))
  , authChecks = require('./auth-checks')
  , sessionCtrl = require('./session')
  , userCtrl = require('./user')
  , commonHlp = require('../helpers/common')
  , routesHlp = require('../helpers/routes')
  , errCfg = require('../config/errors')
  ;


// LOCAL HELPERS

// Generates a new pair hash + salt from a password.
var _hashPassword = function (password) {
  return bcrypt.genSaltAsync(10)
    .then(function (result) {
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
  error1 = error1 || {};
  error2 = error2 || {};
  return {
    code: !_.isUndefined(error1.code) ? error1.code : error2.code,
    data: !_.isUndefined(error1.data) ? _.extend(error2.data, error1.data)
      : error2.data,
    options: !_.isUndefined(error1.options) ?
      _.extend(error2.options, error1.options) : error2.options
  };
};


// Resolves a checklist.
// Returned promise resolves to an object {verdict: boolean, errName: object}.
// - verdict is true only if no checks resolve to false.
// - errName is the name of the error produced by the first check to fail, or
// undefined if none does.
var _resolveCheckList = function (req, checkList) {
  return new Promise(function (resolve, reject) {
    if (checkList.length <= 0)
      resolve({verdict: true});
    else {
      var check = authChecks[checkList[0].name];
      check.method.apply(null, checkList[0].args)(req)
        .then(function (verdict) {
          if (verdict)
            _resolveCheckList(req, checkList.slice(1))
              .then(function (result) {
                resolve(result);
              })
              .catch(commonHlp.rejectPromise(reject));
          else
            resolve({verdict: false, errName: check.error});
        })
        .catch(commonHlp.rejectPromise(reject));
    }
  });
};


// Resolves a list of checklists. For each of them, if it has the 'flag'
// property, a boolean is written in 'req.flags' under that name with the
// verdict. If it also has the 'softFlag' property, only true verdicts
// write/overwrite the flag on 'req.flags'.
// Returned promise resolves to an object {verdict: boolean, errName: string}.
// - verdict is true if none of the checklists has a false verdict.
// - errName is the name of the error produced by the first checklist to fail.
// It is always undefined for true verdicts.

//@todo: change softFlag behaviour so it can be used for true or false.
var _resolveCheckLists = function (req, checkLists) {
  return new Promise(function (resolve, reject) {
    req.flags = req.flags || {};
    Promise.all(_.map(checkLists, function (cl) {
      return _resolveCheckList(req, cl.list);
    }))
      .then(function (results) {
        var finalResult = {verdict: false};
        results.forEach(function (result, index) {
          if (result.verdict) {
            if (checkLists[index].flag) {
              req.flags[checkLists[index].flag] = true;
            }
            finalResult.verdict = true;
          }
          else if (!finalResult.errName) {
            if (checkLists[index].flag && !checkLists[index].softFlag) {
              req.flags[checkLists[index].flag] = false;
            }
            finalResult.errName = result.errName;
          }
        });
        resolve(finalResult);
      })
      .catch(commonHlp.rejectPromise(reject));
  });
};


// FUNCTIONALITY

//
auth.middleware = function (checkLists, optCheckLists, idTokenLoc,
                            baseErrName) {

  idTokenLoc = idTokenLoc || {
      prop: 'headers',
      param: 'authentication'
    };

  return function (req, res, next) {
    var idToken = req[idTokenLoc.prop][idTokenLoc.param];
    req.session = null;

    sessionCtrl.findOne({id_token: idToken})
      .then(function (session) {
        if (session && session.User && _validateSession(session)) {
          return _extendSession(session);
        }
        else {
          throw _.extend(new Error(), {name: 'sessionError'});
        }
      })
      .then(function (session) {
        if (session) {
          req.session = session;
          return (checkLists && checkLists.length > 0) ?
            _resolveCheckLists(req, checkLists) : {verdict: true};
        }
        else {
          throw _.extend(new Error(), {name: 'sessionError'});
        }
      })
      .then(function (result) {
        if (result.verdict) {
          return (optCheckLists && optCheckLists.length > 0) ?
            _resolveCheckLists(req, optCheckLists) : null;
        }
        else {
          throw _.extend(new Error(), {name: result.errName});
        }
      })
      .then(function () {
        next();
      })
      .catch(function (err) {
        console.log(err);
        var error = _mergeErrors(errCfg[baseErrName], errCfg[err.name] ||
          errCfg.serverError);
        routesHlp.sendResponse(res, error.code, error.data, error.options,
          req.session);
      })
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


//var next = function () {
//  console.log('PASSED THE TESTS!')
//};
//
//var res = {
//  status: function (code) {
//    console.log('ERROR CODE: ' + code);
//    return this;
//  },
//  json: function (err) {
//    console.log('ERROR DATA: ' + err.data.msg);
//  }
//};
//
//var cls = [{
//  list: [{name: 'permission', args: ['ProfileViewOwn']}, {name: 'identity'}],
//  flag: 'identity',
//  softFlag: true
//}, {
//  list: [{name: 'permission', args: ['ProfileViewAll']}],
//}];
//
//auth.signIn('bob@example.com', '4321')
//  .then(function (session) {
//    if (!session)
//      throw new Error('Invalid session!');
//    var req = {
//      headers: {'nd-authentication': session.id_token},
//      params: {userId: '1'}
//    };
//    auth.middleware(cls)(req, res, next);
//  })
//  .catch(function (err) {
//    console.log(err);
//  });

module.exports = auth;

