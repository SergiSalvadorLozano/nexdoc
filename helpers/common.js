'use strict';

module.exports = function (){
	var commonHlp = {};


	// DEPENDENCIES

	var crypto = require('crypto');


  // FUNCTIONALITY

	// Returns a typical reject function.
	commonHlp.rejectPromise = function (reject, verbose) {
    return function (err) {
      if (verbose)
        console.log(err);
      reject(err);
    };
  };


  // Generates a random alphanumeric string.
	commonHlp.generateString = function (strLength) {
		var str = ''
			, randHexNums
			, validChars = '0123456789' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
				'abcdefghijklmnopqrstuvwxyz';

		strLength = typeof strLength === 'number' ? strLength : 100;
		randHexNums = crypto.randomBytes(strLength * 4).toString('hex');

		for (var i = 0 ; i < strLength ; i += 1)
			str += validChars.charAt(
				parseInt(randHexNums.substring(8*i, 8*(i+1)), 16) % validChars.length);
		return str;
	};


  // Returns the current date plus a given amount of time.
	commonHlp.soon = function (plusMinutes) {
    plusMinutes = typeof plusMinutes === 'number' ? plusMinutes : 30;
    return new Date(Date.now() + plusMinutes * 60000);
  };


  return commonHlp;
}();
