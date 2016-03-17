/* 
	Experimental: bower config
 */
var path 			= require('path');
var fs 				= require('fs');
var appDir 			= path.dirname(require.main.filename);
var bower 			= require('../bower.json');
var bowerFolder 	= appDir + '/bower_components';
var bowerFiles 		= {};

/*
	Retrieve all bower dependencies and hook 'em up to an array
 */
if(bower.devDependencies) {
	for(dep in bower.devDependencies) {
		if(fs.existsSync(bowerFolder + '/' + dep)) {
			var depBower 	= require(bowerFolder + '/' + dep + '/bower.json');
			var ext 		= path.extname(depBower.main).replace('.','');

			if(!bowerFiles[ext]) {
				bowerFiles[ext] = [];
			}

			bowerFiles[ext].push(dep + '/' + depBower.main);
		}
	}
}

module.exports = bowerFiles;