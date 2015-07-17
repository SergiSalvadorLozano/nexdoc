'use strict';

module.exports = function (){
  var auth = {};


  // DEPENDENCIES

  var Promise = require('bluebird')
    , userCtrl = require('./user');


  // HELPER FUNCTIONS

  // Checks whether a given user possesses the required permissions.
  var _checkUserPermissions = function (user, reqPerm) {
    var authorised = true
      , userPerm = JSON.parse(user.permissions);
    reqPerm.forEach(function (permission) {
      if (userPerm.indexOf(permission) < 0)
        authorised = false;
    });
    return authorised;
  };


  // Checks whether a user's token is valid (hasn't expired).
  var _checkTokenValidity = function (user) {
    return !user.idTokenExpiry || user.idTokenExpiry >= new Date();
  };


  // Checks whether a user's identity corresponds with the one required.
  var _checkUserIdentity = function (user, userId) {
    return user.id === userId;
  };


  // Checks whether a given idToken is valid, and belongs to a user who fulfills
  // permission (and optionally identity) requirements.
  // Returns a promise that resolves to a User model or null, respectively.
  var _authenticate = function (idToken, reqUserId, reqPerm) {
    console.log(idToken + ' ' + reqUserId + ' ' + reqPerm);

    return new Promise (function (resolve, reject) {
      userCtrl.findOne({idToken: idToken})
        .then(function (user) {
          if (user && _checkTokenValidity(user) &&
            _checkUserPermissions(user, reqPerm) &&
            (reqUserId === null || _checkUserIdentity(user, reqUserId)))
            resolve(user);
          resolve(null);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  };



  var checks = {

    identity: {
      method: function (reqProperty, userIdParam) {
        return function (req) {

        }
      }
    }

  };


  // Generates an aphanumeric string to be used as ID Token.
  var _generateString = function () {
    var str = ''
      , strLength = 100
      , strChars = '0123456789' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
          'abcdefghijklmnopqrstuvwxyz';

    for (var i = 0 ; i < strLength ; i += 1)
      str += strChars.charAt(Math.floor(Math.random() * strChars.length));
    return str;
  };


  // Returns the current date plus a set amount of time.
  var _soon = function () {
    var plusMinutes = 30;
    return new Date(Date.now() + plusMinutes * 60000);
  };


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
  auth.getMiddleware = function (reqPerm, self) {
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
  };









  // Not working.
  auth.signIn = function (username, password, permanence) {
    return new Promise (function (resolve, reject) {
      userCtrl.findOne({username: username, password: password})
        .then(function (user) {
          if (!user)
            return Promise.resolve(null);
          var newValues = { idToken: _generateString() };
          newValues.idTokenExpiry = permanence ? null : _soon();
          return userCtrl.updateOne({id: user.id}, newValues);
        })
        .then(function (user) {
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


  return auth;
}();
