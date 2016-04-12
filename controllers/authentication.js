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
  , constants = require('../config/constants')
  , errCfg = require('../config/errors')
  ;


// LOCAL HELPERS

// Generates a new pair hash + salt from a password.
var _hashPassword = function (password) {
  return bcrypt.genSaltAsync(constants.BCRYPT_ITERATION_NUMBER)
    .then(function (result) {
      return bcrypt.hashAsync(password, result, null);
    })
};


// Verifies the validity of a given password against a hash + salt pair.
var _validatePassword = function (password, hash) {
  return bcrypt.compareAsync(password, hash);
};


// Merges two error objects through Union. First object takes precedence.
var _mergeErrors = function (error1, error2) {
  error1 = error1 || {};
  error2 = error2 || {};

  return {
    code: error1.code || error2.code,
    data: error1.data && error2.data ? _.extend(error2.data, error1.data)
      : (error1.data ? error1.data : (error2.data ? error2.data : null)),
    options: error1.options && error2.options ?
      _.extend(error2.options, error1.options) : (error1.options ?
      error1.options : (error2.options ? error2.options : null))
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
          if (verdict) {
            _resolveCheckList(req, checkList.slice(1))
              .then(function (result) {
                resolve(result);
              })
              .catch(commonHlp.rejectPromise(reject));
          }
          else {
            resolve({verdict: false, errName: check.error});
          }
        })
        .catch(commonHlp.rejectPromise(reject));
    }
  });
};


// Resolves a list of checklists. For each of them, if it has the 'flag'
// property (string), a boolean is written in 'req.flags' with that name
// containing the verdict. If it also has the 'softFlag' property defined, only
// verdicts with its same boolean value will write/overwrite the flag on
// 'req.flags'.
// The returned promise resolves to an object {verdict: boolean, errName: string}.
// - 'verdict' is true unless all of the checklists have a false verdict.
// - 'errName' is the name of the error produced by the first checklist to fail.
//   It is always undefined for true verdicts.

var _resolveCheckLists = function (req, checkLists) {
  return new Promise(function (resolve, reject) {
    Promise.all(_.map(checkLists, function (cl) {
      return _resolveCheckList(req, cl.list);
    }))
      .then(function (results) {
        var finalResult = {verdict: false};
        results.forEach(function (result, index) {
          if (checkLists[index].flag &&
            checkLists[index].softFlag === result.verdict) {
            req.flags[checkLists[index].flag] = result.verdict;
          }
          if (result.verdict) {
            finalResult.verdict = true;
          }
          else if (!finalResult.errName) {
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
auth.middleware = function (checkLists, optCheckLists, acTokenLoc, rfTokenLoc,
                            baseErrName) {

  acTokenLoc = acTokenLoc || {
      prop: 'headers',
      param: 'authentication'
    };

  rfTokenLoc = rfTokenLoc || {
      prop: 'headers',
      param: 'authentication-refresh'
    };

  return function (req, res, next) {
    var acToken = req[acTokenLoc.prop][acTokenLoc.param] || null
      , rfToken = req[rfTokenLoc.prop][rfTokenLoc.param] || null
      , refresh = !!rfToken
      ;

    req.session = null;
    req.flags = {sessionRefresh: refresh};

    sessionCtrl.findOne(refresh ? {refreshToken: rfToken} :
    {accessToken: acToken})
      .then(function (session) {
        if (session && session.User &&
          sessionCtrl.validateSession(session, refresh)) {
          return sessionCtrl.extendSession(session, refresh);
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
          req.session ? sessionCtrl.filterOutput(req.session,
            {refresh: req.flags.sessionRefresh}) : null);
      })
  };
};


//
auth.signIn = function (email, password, remember) {
  var _user;
  return userCtrl.findOne({email: email})
    .then(function (user) {
      _user = user;
      if (user)
        return _validatePassword(password, user.password);
    })
    .then(function (verdict) {
      if (verdict)
        return sessionCtrl.createOne(_user, remember);
    })
};


//
auth.signOut = function (rfToken) {
  return sessionCtrl.delete({refreshToken: rfToken});
};


//
auth.signUp = function (values) {
  return _hashPassword(values.password)
    .then(function (password) {
      values.password = password;
      return userCtrl.createOne(values);
    })
    .then(function (user) {
      return sessionCtrl.createOne(user);
    });
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
//      headers: {'authentication-refresh': session.refreshToken},
//      params: {userId: '2'}
//    };
//    auth.middleware(cls)(req, res, next);
//  })
//  .catch(function (err) {
//    console.log(err);
//  });

module.exports = auth;

