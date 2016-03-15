/*
	SoundsManager v1.0
	- AMD wrapper help: http://gomakethings.com/the-anatomy-of-a-vanilla-javascript-plugin/
 */

(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(['SoundsManager'], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(require('SoundsManager'));
    } else {
        root.SoundsManager = factory(root, root.SoundsManager);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//
	var SoundsManager;

	//
	// Constructor SoundsManager
	//
	SoundsManager = new function SoundsManager(){
		this.basePath = '/sounds/';
		this.files = [];
	};

	//
	// Methods
	//

	/**
     * calls the api and appends its results to the soundsmanager
     * @private
     */
	function getFiles() {
		$.get('/api/files', function(response) {
			SoundsManager.files = response;
		});
	}

	getFiles();
	return SoundsManager;

});
