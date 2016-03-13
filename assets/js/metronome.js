/*
	Metronome v1.0
	- AMD wrapper help: http://gomakethings.com/the-anatomy-of-a-vanilla-javascript-plugin/
 */

(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(['Metronome'], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(require('Metronome'));
    } else {
        root.Metronome = factory(root, root.Metronome);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//
	var Metronome;
	var tickInterval;

	//
	// Constructor
	//
	Metronome = new function Metronome(){
		this.bpm 			= 128;
		this.ticking 		= false;
		this.paused 		= false;
		this.currentTick 	= 0;
		this.totalTicks 	= 8;
	}

	// 
	// Methods
	//
	
	/**
     * clears the ticker
     * @private
     */
	function clearTicker() {
		if(tickInterval) {
			clearInterval(tickInterval);
			tickInterval = null;
		}
	}

	/**
     * handles a bpm change
     * @private
     */
	function changeBPM() {
		if(this.ticking) {
			stopTicker.apply(this);
			startTicker.apply(this);
		}
	}

	/**
     * handles a single tick as invoked by the ticker
     * @private
     */
	function tickHandler() {

		if(this.paused) return;

		if(this.currentTick > this.totalTicks-1) {
			this.currentTick = 0;
		}

		this.tick();
		this.currentTick++;
	}

	/**
     * starts the ticker internally
     * @private
     */
	function startTicker() {
		var bpm = this.bpm;

		tickInterval = setInterval(function() {
			tickHandler.apply(Metronome);
		}, (1000 * 60 / bpm) / 2);

		this.paused = false;
		this.ticking = true;
		tickHandler.apply(Metronome);
	}

	/**
     * stops the ticker internally
     * @private
     */
	function stopTicker() {
		clearTicker();
		this.paused = true;
		this.ticking = false;
	}

	/**
     * resets all ticker properties
     * @private
     */
	function resetTicker() {
		this.paused 		= false;
		this.ticking 		= false;
		this.currentTick 	= 0;
		this.tick();
	}

	/**
     * Starts the ticker
     * @public
     */
	Metronome.start = function() {
		if(!this.ticking) startTicker.apply(this);
	}

	/**
     * Stops and resets the ticker
     * @public
     */
	Metronome.stop = function() {
		stopTicker.apply(this);
		resetTicker.apply(this);
	}
	/**
     * Pauses the ticker
     * @public
     */
	Metronome.pause = function() {
		stopTicker.apply(this);
	}

	/**
     * Sets the BPM and syncs the ticker with the new bpm
     * @public
     */
    Metronome.setBPM = function(bpm) {
    	if(!bpm) return;
    	this.bpm = bpm;
    	changeBPM.apply(this);
    }

	/**
     * Callback on tick, supposed to be overwritten for custom tick callback
     * @public
     */
    Metronome.tick = function() {}

	return Metronome;

});
