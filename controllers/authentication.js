'use strict';

module.exports = function (){
  var auth = {};


  // DEPENDENCIES

  var Promise = require('bluebird')
    , userCtrl = require('./user')
    , comHlp = require('../helpers/common');


  // PRIVATE ATTRIBUTES

  // Custom authentication checks
  var checks = {

    // Checks that the requesting user has a given id.
    identity: {
      method: function (userIdLoc) {
        if (typeof userIdLoc === 'undefined')
          userIdLoc = {
            prop: 'params',
            param: 'userId'
          };
        return function (req) {
          return new Promise (function (resolve) {
            console.log(userIdLoc);
            resolve(req.user.id === req[userIdLoc.prop][userIdLoc.param]);
          });
        };
      },
      error: {
        code: 401,
        data: 'User\'s identity mismatch.'
      }
    },

    // Checks that the requesting user has a given permission.
    permission: {
      method: function (permReq) {
        return function (req) {
          return new Promise (function (resolve) {
            resolve(true);
          });
        };
      },
      error: {
        code: 401,
        data: 'Insufficient permissions for request.'
      }
    }

    // Add more custom checks here.
  };


  // LOCAL HELPERS

  // Checks whether a user's token is valid (hasn't expired).
  var _checkTokenValidity = function (user) {
    return !user.idTokenExpiry || user.idTokenExpiry >= new Date();
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
        check.method.apply(this, checkList[0].args)(req)
          .then(function (verdict) {
            if (verdict)
              _resolveCheckList(req, checkList.slice(1))
                .then(function (result) {
                  resolve(result);
                })
                .catch(comHlp.rejectPromise(reject));
            else
              resolve({verdict: false, resErr: check.error});
          })
          .catch(comHlp.rejectPromise(reject));
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
                .catch(comHlp.rejectPromise(reject));
            }
          })
          .catch(comHlp.rejectPromise(reject));
      }
    });
  };


  // FUNCTIONALITY

  //
  auth.authMiddleware = function (checkLists, idTokenLoc, resErr){
    if (!checkLists || checkLists.length === 0)
      checkLists = [[]];
    if (!idTokenLoc)
      idTokenLoc = {
        prop: 'headers',
        param: 'authentication'
      };
    return function (req, res, next) {
      userCtrl.findOne({idToken: req[idTokenLoc.prop][idTokenLoc.param]})
        .then(function (user) {
          if (user && _checkTokenValidity(user)) {
            req.user = user;
            return _resolveCheckLists(req, checkLists, resErr);
          }
          else
            return Promise.resolve({verdict: false, resErr: tokenAuthError});
        })
        .then(function (result) {
          if (result.verdict)
            next();
          else
            res.status(result.resErr.code).json(result.resErr.data);
        })
        .catch(function (err) {
          console.log(err);
          res.sendStatus(500);
        });
    };
  };


  // Not working.
  auth.signIn = function (username, password, permanence) {
    return new Promise (function (resolve, reject) {
      userCtrl.findOne({username: username, password: password})
        .then(function (user) {
          console.log('USER: ' + JSON.stringify(user));
          if (!user)
            return Promise.resolve(null);
          var newValues = { idToken: _generateString() };
          newValues.idTokenExpiry = permanence ? null : comHlp.soon();
          return userCtrl.updateOne({id: user.id}, newValues);
        })
        .then(function (user) {
          console.log('USER: ' + JSON.stringify(user));
          resolve(user);
        })
        .catch(function (err) {
          reject(err);
        })
    });
  };



  auth.signIn('Alice', '1234', false)
    .then(function (user) {
      console.log('USER: ' + JSON.stringify(user));
    });


  /*var next = function () {
    console.log('PASSED THE TESTS!')
  };

  var req = {
    headers: {authentication: 'lol'},
    params: {userId: 0}
  };

  var res = {
    status: function (code) {
      console.log('ERROR CODE: ' + code);
      return this;
    },
    sendStatus: function (code) {
      console.log('ERROR CODE: ' + code);
    },
    json: function (data) {
      console.log('ERROR DATA: ' + data);
    }
  };

  var cls = [
    [{name: 'permission', args: ['something']}],
    [{name: 'identity'}]
  ];

  auth.authMiddleware(cls)(req, res, next);*/



  // FUNCTIONALITY

  // Returns an Express middleware that verifies the idToken passed in the
  // 'authentication' header, plus other optional conditions.
  // PARAMETERS
  // [@reqPerm]: array of strings with permission requirements.
  // [@self]: boolean enabling identity validation against 'req.params.userId'.
  // RETURNS
  // An express middleware function. If successful, passes the user model to the
  // next function in 'req.user'. If validation fails sends a 401 code in the
  // response, or a 500 code if there has been a server error.
  /*auth.getMiddleware = function (reqPerm, self) {
    return function (req, res, next) {
      var idToken = req.headers['authentication']
        , reqUserId = null;

      if (typeof reqPerm === 'undefined')
        reqPerm = [];

      if (self && typeof req.params.userId !== 'undefined')
        reqUserId = req.params.userId;

      _authenticate(idToken, reqUserId, reqPerm)
        .then(function (user) {
          if (user) {
            req.user = user;
            next();
          }
          else
            res.sendStatus(401);
        })
        .catch(function (err) {
          console.log('ERROR: ' + err);
          res.sendStatus(500);
        });
    };
  };*/















  return auth;
}();
