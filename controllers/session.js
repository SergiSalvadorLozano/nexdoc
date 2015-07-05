'use strict';

module.exports = function (){
  var sessionCtrl = {};

  // DEPENDENCIES
  var userCtrl = require('./user');

  // HELPER FUNCTIONS

  // Generates an aphanumeric string to identify a session.
  var _generateSessionId = function () {
    var sessionId = ''
      , idLength = 100
      , idChars = '0123456789' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz';

    for (var i = 0 ; i < idLength ; i += 1)
      sessionId += idChars.charAt(Math.floor(Math.random() * idChars.length));
    return sessionId;
  };

  // FUNCTIONALITY

  // Returns a User model with the given sessionId.
  sessionCtrl.getUser = function (sessionId) {
    return userCtrl.findOne({});
  };




  return sessionCtrl;
}();
