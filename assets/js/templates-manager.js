/*
	TemplatesManager v1.0
	- AMD wrapper help: http://gomakethings.com/the-anatomy-of-a-vanilla-javascript-plugin/
 */

(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(['TemplatesManager'], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(require('TemplatesManager'));
    } else {
        root.TemplatesManager = factory(root, root.TemplatesManager);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//
	var TemplatesManager;
	var Template;
	var templatesLoaded = 0;
	var templatesToLoad = 0;

	//
	// Constructor Template 
	//
	Template = function() {
		this.id = 0;
		this.name = null;
		this.raw = null;
		this.render = null;
		this.data = {};
	}

	/**
     * renders the handlebars template with data
     * @returns String
     * @public
     */
	Template.prototype.html = function() {
		return this.render(this.data);
	}

	//
	// Constructor TemplatesManager
	//
	TemplatesManager = new function TemplatesManager() {
		this.baseURL = 'handlebars/';
		this.templates = [];
	}

	// 
	// TemplatesManager Methods
	//

	/**
     * loads the templates async
     * @param templates [Array]
     * @returns Promise
     * @public
     */
	TemplatesManager.load = function(templates) {
		if(!templates) return;

		var self = this;
		templatesToLoad = templates.length;

		return new Promise(function(resolve, reject) {

			templates.forEach(function(template, i) {
				$.get(self.baseURL + template, function(response) {
					templatesLoaded++;

					var t = new Template();
					t.id = i;
					t.raw = response;
					t.name = template.split('.')[0];
					t.render = Handlebars.compile(t.raw);

					self.templates.push(t);

					if(templatesLoaded == templatesToLoad) {
						resolve();
					}
				});
			});

		});

	}

	/**
     * returns a template based on name
     * @param name [String]
     * @returns Template [Object]
     * @public
     */
    TemplatesManager.get = function(name) {
    	var result = this.templates.filter(function(template) {
    		return template.name === name;
    	});
    	if(result.length == 0) return;
    	return result[0];
    }

	return TemplatesManager;

});
