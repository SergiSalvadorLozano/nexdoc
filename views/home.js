// Views for the 'Home' section.

module.exports = function (){
	var lang = require('../lib/lang.js'),
		db = require('../lib/db-functions.js');
	
	var exports = {};
	
	// View for the 'Welcome' subsection.
	exports.welcome = function (request, response) {
		var langCode = request.params.langCode;
		var data = {
			section: 'home',
			subsection: 'welcome',
			langCode: langCode,
			strings: lang.getStrings(langCode),
		}
		
		response.render('home/welcome', data);
	};

	return exports;
}();