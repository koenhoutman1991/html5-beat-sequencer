/*
	TracksManager v1.0
	- AMD wrapper help: http://gomakethings.com/the-anatomy-of-a-vanilla-javascript-plugin/
 */

(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(['TracksManager'], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(require('TracksManager'));
    } else {
        root.TracksManager = factory(root, root.TracksManager);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//
	var tracksIndex = 1;
	var TracksManager;
	var Track;

	//
	// Private functions
	//


	//
	// constructor Track
	//
	Track = function() {
		this.id 			= 0;
		this.name 			= null;
		this.file 			= '';
		this.bars 			= 2;
		this.template 		= TemplatesManager.get('track');
		this.dom 			= null;
		this.muted 			= false;
		this.volume 		= 1;

		this.template.data 	= this;
	}

	//
	// Constructor TracksManager
	//
	TracksManager = new function TracksManager(){
		this.tracks = [];
		this.beatsPerTrack = 16; // = 4 bars
	}

	// 
	// TracksManager Methods
	//

	/**
     * adds a new track to the tracks array
     * @param options [Object]
     * @returns Track
     * @public
     */
	TracksManager.add = function(options) {
		var self 	= this;
		var track 	= new Track();
		track.id 	= tracksIndex;
		track.name 	= options.name ? options.name : 'Untitled ' + tracksIndex;
		track.file 	= options.file ? options.file : null;
		track.beats = this.beatsPerTrack;

		this.tracks.push(track);

		tracksIndex++;

		this.onAdd(track);
		return track;
	}

	/**
     * adds a new track to the tracks array
     * @param options [Object]
     * @returns Track
     * @public
     */
    TracksManager.delete = function(track) {

    	var posInArray 	= 0;
    	var result 		= null;
    	this.each(function(res, i) {
    		if(res.id == track.id) {
    			posInArray = i;
    			result = res;
    		}
    	});

    	if(result) {
    		this.tracks.splice(posInArray, 1);
    		this.onDelete(result);
    	}

    }

    /**
     * Simple iterator over all tracks
     * @param callback [function(track)]
     * @returns void
     * @public
     */
    TracksManager.each = function(callback) {
    	this.tracks.forEach(function(track, i) {
    		if(callback && typeof callback === 'function') callback(track, i);
    	});
    }

	/**
     * Callback function when a track has been added
     * @param track [Track]
     * @returns void
     * @public
     */
	TracksManager.onAdd = function(track) {};

	/**
     * Callback function when a track has been deleted
     * @param track [Track]
     * @returns void
     * @public
     */
	TracksManager.onDelete = function(track) {};

	return TracksManager;

});
