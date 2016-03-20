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

		//
		// properties
		//
		this.attributes = [];
		this.data = [];
		this.model = {};

		// methods

		/**
		 * initializes this container with an object
		 * @param obj [object] (optional)
		 * @public
		 */
		this.init = function(obj) {

			if(obj) {
				for(var prop in obj) {
					this.set(prop, obj[prop]);
				}
			}

			return this;
		};

		/**
		 * sets a key onto the data object
		 * @param obj [object]
		 * @public
		 */
		this.set = function(key, value) {
			if(typeof value === 'function') value = value.call(this)
			this.model[key] = value;

			if(!this.attributes.indexOf(key)) {
				this.attributes.push(key);
			}
		}

		/**
		 * appends an entry to the data scope
		 * @param obj [object]
		 * @public
		 */
		this.entry = function(obj) {

			var self = this;
			var currentEntries = this.data.length;

			var entry = {
				_id: currentEntries+1
			};

			// embed a removing method to the entry
			entry._remove = function() {
				var data = self.data;
				console.log(data.find(this));
			}

			for(var prop in this.model) {
				if(obj.hasOwnProperty(prop)) {
					entry[prop] = obj[prop];
					if(typeof entry[prop] === 'function') {
						entry[prop] = entry[prop]();
					}
				} else {
					entry[prop] = null;
				}
			}

			this.data.push(entry);

		}

	}

	//
	// Constructor Store
	//
	Store = new function Store(){
		this.attributes = [];
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
     * updates public data scope
     * @param key [string]
     * @param value [any]
     * @public
     */
    Store.set = function(key, value) {
    	if(typeof value === 'function') value = value.call(this);
    	this.data[key] = value;
    	if(!this.attributes.indexOf(key)) {
    		this.attributes.push(key);
    	}
    }

    /**
     * returns a key from the public data scope
     * @param key [string]
     * @public
     */
  	Store.get = function() {

  	}

    /**
     * defines a container and adds it to the scope
     * @public
     */
    Store.container = function(name, setup) {

    	var container;

    	if(setup) {
    		container = new StoreContainer();
	    	container.init(setup);
	    	this.containers[name] = container;
    		this.set(name, container);
    	} else {
    		container = this.containers[name];
    	}

    	return container;
    }

    /**
     * pushes a container instance to the store
     * @public
     */
    Store.create = function(name, config) {
    	var container = this.containers[name];
    }

	return Store;

});
