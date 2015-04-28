// Helper library with language functionalities.

module.exports = function (){
	var fs = require('fs');
	
	var exports = {};
	
	
	// Array of codes identifying each language.
	exports.codes = ['en', 'es', 'ca', 'fr'];
	
	
	// Regular expression for catching the language code in a URL.
	exports.regexp = ':langCode(en|es|ca|fr)';
	
	
	// Language name corresponding to each language code.
	exports.names = {
		'en': 'English',
		'es': 'Español',
		'ca': 'Català',
		'fr': 'Français'
	};
	
	
	// Returns an object with all static strings in the target language.
	// Arguments:
	//  - Code of the target language.
	
	exports.getStrings = function (langCode) {
		return JSON.parse(fs.readFileSync(
			__dirname + '/../static/strings/' + langCode + '.json', 'utf8'));
	};
	
	
	return exports;
}();