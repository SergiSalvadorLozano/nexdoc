'use strict';

module.exports = function (){
  var helpers = {};

  // FUNCTIONALITY

  helpers.rejectPromise = function (reject, verbose) {
    return function (err) {
      if (verbose)
        console.log(err);
      reject(err);
    };
  };


  // Generates an aphanumeric string to be used as ID Token.
  helpers.generateString = function (strLength) {
    var str = ''
      , strChars = '0123456789' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
          'abcdefghijklmnopqrstuvwxyz';

    strLength = typeof strLength === 'number' ? strLength : 100;
    for (var i = 0 ; i < strLength ; i += 1)
      str += strChars.charAt(Math.floor(Math.random() * strChars.length));
    return str;
  };


  // Returns the current date plus a given amount of time.
  helpers.soon = function (plusMinutes) {
    plusMinutes = typeof plusMinutes === 'number' ? plusMinutes : 30;
    return new Date(Date.now() + plusMinutes * 60000);
  };


  return helpers;
}();
