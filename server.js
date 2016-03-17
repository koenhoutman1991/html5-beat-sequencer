var express = require('express');
var ejs 	= require('ejs');
var layouts = require('express-ejs-layouts');
var fs 		= require('fs');
var app 	= express();


app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.use(layouts);

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/bower_components'));

/*
 *	stores app-specific information
 *	- is also the template variable scope
 */
var local = {};

/*
 *	retrieves bower component assets and stores them local
 */
local.bower = require('./lib/map-bower-files');

/*
 * request handler for each request
 * - appends local scope to the response object
 */
app.use(function(req, res, next) {
	res.locals = local;
	next();
});

/*
 * index route, renders the application view
 * - appends local scope to the response object
 */
app.get('/', function(req, res) { 
	res.render('app'); 
});

app.use('/api', require('./api'));

app.listen(1234);
