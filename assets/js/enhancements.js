// prototype Array.forEach onto NodeList
NodeList.prototype.forEach = Array.prototype.forEach;

// custom boolean parse function into string
String.prototype.bool = function() {
	return (/^true$/i).test(this);
}

/* 
	Storing custom UI bindings causes the custom ui functions to be reused, for 
	example once we append a new input of that custom type, we can look its binding 
	up here and apply it to the new element.
	this way, everything keeps in sync and prevents minor changes in the codebase
	and thus grants for stability.
 */
var CustomUIBindings = {
	/* 
		CustomUIBindings.bpmInputBinding
		- limit BPM input to only 3 chars max
		- allow input to not be smaller than 1
		- allow input to not be greater than 500
		- feedbacks user in automatic correction

		to do:
	 */
	bpmInputBinding: function(el) {
		var input = el.querySelector('input[type=number]');
		
		el.oninput = function(evt) {
			if(input && input.value.length >= 3) input.value = input.value.slice(0, 3);
		}

		if(input) {
			input.onblur = function(evt) {
				if(this.value > 500) this.value = 500;
				if(this.value < 1) this.value = 1;
			}
		}
	},
	/*
		CustomUIBindings.toggleEditBinding
		- uses a toggle element to define its state (default/edit)
		- handles toggle click to switch between states
		- should allow ui styles through state classes

		to do:
		- should dispatch event on change or toggle for functionality purposes
	 */
	toggleEditBinding: function(el) {

		var toggle 		= el.querySelector('.toggle');
		var input 		= el.querySelector('input');
		var text 		= el.querySelector('span');
		var toggleState = function(state) {

			var isEdit = el.dataset.edit = state ? false : true;
			el.classList.toggle('is-edit', isEdit);

			if(!isEdit) {
				if(input.value.length) {
					text.innerHTML = input.value;
				} else {
					input.value = text.innerHTML;
				}
			}

		};

		if(toggle) {
			toggle.addEventListener('click', function(evt) {
				evt.preventDefault();
				toggleState(el.dataset.edit.bool());
			});
		}

		el.dataset.edit = false;
		input.value = text.innerHTML;

	},
	/*
		CustomUIBindings.beatpadBinding
		- listens to a click on its child button to activate / deactivate it
		- toggles its active class synced to the toggled state

		to do:
	*/
	beatpadPadBinding: function(el) {

		var button 		= el.querySelector('.beatpad__button');
		var toggleState = function(state) {
			var isActivated = el.dataset.toggled = state ? false : true;
			el.classList.toggle('active', isActivated);
		};

		button.addEventListener('click', function(evt) {
			evt.preventDefault();
			toggleState(el.dataset.toggled.bool());
		});

		el.dataset.toggled = false;

	},
	/*
		CustomUIBindings.syncOverflowingTracks
		- get the current active scrolling element and sync it with its identical matches

		to do:
		- sets a state where the track is scrolled to the maximum left
		- sets a state where the track is scrolled to the minimum left
	*/
	syncOverflowingTracks: function(scrollLeft) {

		var tracks = document.querySelectorAll('#project-window .track:not(.track__new) .track__content');

		tracks.forEach(function(track) {

			track.scrollLeft = scrollLeft;

			if(track.scrollLeft <= 10) {
				track.parentNode.classList.add('scroll-start');
			} else {
				track.parentNode.classList.remove('scroll-start');
			}

			if(track.scrollLeft+20 >= track.scrollWidth - track.clientWidth) {
				track.parentNode.classList.add('scroll-end');
			} else {
				track.parentNode.classList.remove('scroll-end');	
			}

		});

	},

	/*
		CustomUIBindings.audioSelectionBinding
		- handles the toggle between audio select and audio show
		- handles the select callback
		- swaps the audio file to the new selected file
	*/
	audioSelectionBinding: function(el) {

		el.dataset.selecting = false;

		var select 	= el.querySelector('select');
		var title 	= el.querySelector('.track__title');
		var toggle 	= el.querySelector('.track__icon');
		var audio 	= el.parentNode.parentNode.querySelector('audio');

		var toggleState = function(state) {
			var isActivated = el.dataset.selecting = state ? false : true;
			el.classList.toggle('select', isActivated);
		}

		select.addEventListener('change', function() {
			var file = this.value;
			var path = SoundsManager.basePath + file
			audio.src = path;
			title.innerHTML = file;

			toggleState(el.dataset.selecting.bool());
		});

		toggle.addEventListener('click', function(e) {
			e.preventDefault();
			toggleState(el.dataset.selecting.bool());
		});

	},

	/*
		CustomUIBindings.trackOptionBindings
		- handles the toggle between audio select and audio show
		- handles the select callback
		- swaps the audio file to the new selected file
	*/
	trackOptionBindings: function(el, track) {

		var mute	= el.querySelector('[data-option=mute]');
		var remove 	= el.querySelector('[data-option=remove]');

		var toggleOption = function(el) {
			var isActive = el.dataset.active.bool();
			el.dataset.active = isActive ? false : true;
			el.classList.toggle('active', el.dataset.active.bool());
		}

		mute.dataset.active = track.muted = false;

		mute.addEventListener('click', function(e) {
			e.preventDefault();
			toggleOption(mute);
			track.muted = mute.dataset.active.bool();
		});	

		remove.addEventListener('click', function(e) {
			e.preventDefault();
			TracksManager.delete(track);
		});

	},

	/*
		CustomUIBindings.trackVolumeBinding
		- catch input changes on the volume slider
		- adjust the audio element's volume property
	*/
	trackVolumeBinding: function(el, track) {

		var trackAudio 		= el.querySelector('.track__file audio');
		var trackVolume 	= el.querySelector('.track__volume input');
		var currentVolume 	= track.volume;

		trackVolume.addEventListener('change', function() {
			var volume = trackAudio.volume = this.value;
			track.volume = trackAudio.volume;
		});

	}

}

// custom handlebars helper that enables FOR loop from a number
Handlebars.registerHelper('iterate', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i+1);
    return accum;
});