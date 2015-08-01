'use strict';

module.exports = function (){
  var auth = {};


  // DEPENDENCIES

  var Promise = require('bluebird')
    , cryptoJS = require('crypto-js')
    , userCtrl = require('./user')
    , comHlp = require('../helpers/common')
    , permCfg = require('../config/permissions');


  // PRIVATE ATTRIBUTES

  // Error returned when the credentials sent in the request are invalid.
  var credentialsError = {
    code: 401,
    data: 'Invalid credentials provided in request.'
  };


  // Error returned when the credentials sent in the request are invalid.
  var serverError = {
    code: 500,
    data: 'Server error during authentication.'
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
            resolve(req.user.id === req[userIdLoc.prop][userIdLoc.param]);
          });
        };
      },
      error: {
        code: 401,
        data: 'User identity mismatch.'
      }
    },

    // Verifies that the requesting user has the given permission.
    permission: {
      method: function (permReq) {
        return function (req) {
          return new Promise (function (resolve) {
            var perms = permCfg.permissions[req.user.role];
            resolve(perms.indexOf(permReq) >= 0);
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

  // Verifies a given signature corresponds with a given email-password pair.
  var _verifySignature = function (signature, email, password) {
    var realSignature = cryptoJS.HmacSHA256(email, password)
      .toString(cryptoJS.enc.Base64);
    return signature === realSignature;
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
  auth.authMiddleware = function (checkLists, emailLoc, signatureLoc, resErr,
    resOptions){

    checkLists = checkLists && checkLists.length > 0 ? checkLists : [[]];
    if (!emailLoc)
      emailLoc = {
        prop: 'headers',
        param: 'nd-auth-email'
      };
    if (!signatureLoc)
      signatureLoc = {
        prop: 'headers',
        param: 'nd-auth-signature'
      };
    resErr = resErr ? resErr : null;
    resOptions = resOptions ? resOptions : {};

    return function (req, res, next) {
      var email = req[emailLoc.prop][emailLoc.param]
        , signature = req[signatureLoc.prop][signatureLoc.param];
      userCtrl.findOne({email: email})
        .then(function (user) {
          if (user && _verifySignature(signature, user.email, user.password)) {
            req.user = user;
            return _resolveCheckLists(req, checkLists, resErr);
          }
          else
            return Promise.resolve({verdict: false, resErr: credentialsError});
        })
        .then(function (result) {
          if (result.verdict)
            next();
          else
            res.status(result.resErr.code)
              .json({data: result.resErr.data, options: resOptions});
        })
        .catch(function (err) {
          console.log(err);
          res.status(serverError.code)
            .json({data: serverError.data, options: resOptions});
        });
    };
  };


  /*var next = function () {
    console.log('PASSED THE TESTS!')
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

  var req = {
    headers: {
      'nd-auth-email': 'alice@example.com',
      'nd-auth-signature': cryptoJS.HmacSHA256('alice@example.com', '1234')
        .toString(cryptoJS.enc.Base64)
    },
    params: {userId: 2}
  };

  var cls = [
    [{name: 'permission', args: ['viewOwnProfile']},
      {name: 'identity'}],
    [{name: 'permission', args: ['viewAllProfiles']}]
  ];

  auth.authMiddleware(cls)(req, res, next);*/



  return auth;
}();
