var express = require('express');
var ejs 	= require('ejs');
var fs 		= require('fs');
var app 	= express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/bower_components'));

console.log(require('./lib/map-bower-files'));

app.get('/', function(req, res) { 
	res.render('app'); 
});

app.use('/api', require('./api'));

app.listen(1234);
