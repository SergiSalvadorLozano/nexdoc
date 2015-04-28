// Main router for all views.

module.exports = function () {
	var express = require('express'),
		lang = require('../lib/lang.js'),
		homeRouter = require('./home.js');
	
	var router = express.Router({mergeParams: true});

	
	// /
	router.get('/', function (request, response) {
		response.redirect('/en/home/welcome');
	});
	
	// /(langCode)/home...
	router.use('/' + lang.regexp + '/home', homeRouter);
	
	
	return router;
}();