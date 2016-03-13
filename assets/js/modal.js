/*
	Modal v1.0
	- AMD wrapper help: http://gomakethings.com/the-anatomy-of-a-vanilla-javascript-plugin/
 */

(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(['Modal'], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(require('Modal'));
    } else {
        root.Modal = factory(root, root.Modal);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	var Modal = function() {
		
	};

	return Modal;

});
