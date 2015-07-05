'use strict';

module.exports = function (){
  var auth = {};

  // DEPENDENCIES

  var passport = require('passport')
    , Promise = require('bluebird')
    , LocalStrategy = require('passport-local')
    , userCtrl = require('./user')
    , sessionCtrl = require('./session');

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
  var _checkTokenValidity = function (user, userId) {
    return !user.idTokenExpiry || user.idTokenExpiry >= Date.now();
  };

  // Checks whether a user's identity corresponds with the one required.
  var _checkUserIdentity = function (user, userId) {
    return user.id === userId;
  };


  auth.authenticate = function (idToken, reqUserId, reqPerm) {
    userId = typeof reqUserId !== 'undefined' ? reqUserId : null;
    reqPerm = typeof reqPerm !== 'undefined' ? reqPerm : [];

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

  // auth.authenticate('abcd', 1, ['p2', 'p1'])
  //   .then(function (user) {
  //     console.log(user);
  //   });

  auth.getMiddleware = function (reqPerm, self) {
    return function (req, res, next) {
      req.body.idToken = req.headers['authentication'];
      req.body.reqPerm = reqPerm;
      req.body.username = req.headers['auth-username'];
      req.body.password = req.headers['auth-password'];

      passport.authenticate('local', function (err, user) {
        // Server error during Passport authentication.
        if (err)
          res.sendStatus(500);
        // Incorrect ID token.
        else if (!user)
          res.sendStatus(401);
        else {
          // Check permissions.
          /*var authorised = true
            , userPerm = JSON.parse(user.permissions);*/


          req.user = user;
          next();
        }
      }, { session: false })(req, res);
    };
  };












  // PASSPORT STRATEGIES

  // User strategy. Accepts any registered user.
  /*passport.use('local', new LocalStrategy( {usernameField: 'idToken',
    passwordField: 'reqPerm'}, function (username, password, done) {

    userCtrl.findOne({username: username, password: password})
      .then(function (user) {
        if (user)
          return done(null, user);
        else
          return done(null, false);
      })
      .catch(function (err) {
        return done(err, false);
      });
  }));*/

  // FUNCTIONALITY

  // Returns an Express middleware that authenticates through Passport.
  // Additionally, checks that the user possesses the required permissions.



  auth.signIn = function (username, password) {

  };




  auth.passport = passport;
  return auth;
}();
