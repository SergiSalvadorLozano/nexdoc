var assert = require('assert'),
	views = require('../../views/home.js'),
	lang = require('../../lib/lang.js'),
	test = require('../../lib/test.js');


// Tests checking 'Home' view functions
describe('\'Home\' Views Module', function () {
	
	it('Should be able to render the \'Welcome\' view', function (done) {
		// Define the test for one language.
		var oneTest = function (langCode, index, oneDone) {

			// Define dummy request and response.
			var request = {params: {langCode: langCode}};
			var response = {render: function (templateName, templateData) {
				// Define expected data.
				var	expectedName = 'home/welcome',
					expectedData = {
						section: 'home',
						subsection: 'welcome',
						langCode: langCode,
						strings: lang.getStrings(langCode),
					}
						
				// Test that the render data corresponds with what's expected.
				assert.equal(templateName, expectedName);
				assert.equal(JSON.stringify(templateData),
					JSON.stringify(expectedData));
				// The test for this language is completed.
				oneDone(langCode);
			}};
			
			// Call the view with the dummy request and response.
			views.welcome(request, response);
		};
		
		// Run the test for every language (concurrently).
		test.forEachElement(lang.codes, oneTest, done);	
	});
	
	
});