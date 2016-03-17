/*
	Store v1.0
	- AMD wrapper help: http://gomakethings.com/the-anatomy-of-a-vanilla-javascript-plugin/
 */

(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(['Store'], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(require('Store'));
    } else {
        root.Store = factory(root, root.Store);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//
	var Store;
	var StoreContainer;

	//
	// Constructor StoreContainer
	//
	StoreContainer = function() {

	}

	//
	// Constructor Store
	//
	Store = new function Store(){
		this.data = {};
		this.containers = {};
	}

	// 
	// Store Methods
	//

	/**
     * initialises the store
     * @public
     */
    Store.init = function(config) {

    }

	/**
     * sets a new data key
     * @public
     */
   	Store.key = function(name, defaultValue) {
   		this.data[name] = defaultValue ? defaultValue : {};
   	}

   	/**
     * gets a key
     * @public
     */
    Store.get = function(name) {
    	if(name) {
    		return this.data[name];
    	} else {
    		return this.data;
    	}
    }

    /**
     * defines a container
     * @public
     */
    Store.container = function(name, setup) {
    	var container = new StoreContainer();
    	if(setup) {
	    	for(var prop in setup) {
	    		container[prop] = setup[prop];
	    	}
    	}
    	this.containers[name] = container;
    	this.key(name, []);
    	return container;
    }

    /**
     * pushes a container instance to the store
     * @public
     */
    Store.create = function(name, config) {

    	var container = this.containers[name];
    	console.log(config);
    	console.log(container);

    }

	return Store;

});
