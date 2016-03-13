/*
 *	0. Load Handlebars Templates
 */
TemplatesManager.baseURL 	= 'handlebars/';
TemplatesManager.load([
	'track.hbs'
]).then(function() {

	// set global beat count for each track
	TracksManager.beatsPerTrack = Metronome.totalTicks = 16;

	// global render function when a track was added
	TracksManager.onAdd = function(track) {

		track.template.data.files = SoundsManager.files;

		var dummy = document.createElement('div');
		document.querySelector('#project-window .project-tracks').appendChild(dummy);
		dummy.innerHTML = track.template.render(track);
		track.dom = dummy;
		track.dom.dataset.track = track;

		dummy.querySelectorAll('.beatpad__pad').forEach(function(el) {
			CustomUIBindings.beatpadPadBinding(el);
		});

		dummy.querySelector('.track__content').addEventListener('scroll', function() {
			CustomUIBindings.syncOverflowingTracks(this.scrollLeft);
		});

		dummy.querySelectorAll('.toggle-edit').forEach(function(el) {
			CustomUIBindings.toggleEditBinding(el);
		});

		CustomUIBindings.audioSelectionBinding(dummy.querySelector('.audio-select'));
		CustomUIBindings.trackOptionBindings(track.dom, track);
		CustomUIBindings.trackVolumeBinding(track.dom, track);

	};

	// handler for discharging track dom data
	TracksManager.onDelete = function(track) {
		track.dom.parentNode.removeChild(track.dom);
	}

	// handle bpm input fields on init
	document.querySelectorAll('.input-bpm').forEach(function(el) {
		CustomUIBindings.bpmInputBinding(el);

		// set bpm when the input field changes
		el.querySelector('input').addEventListener('change', function() {
			Metronome.setBPM(this.value);
		});

	});

	// handle toggleable edit fields on init
	document.querySelectorAll('.toggle-edit').forEach(function(el) {
		CustomUIBindings.toggleEditBinding(el);
	});

	// handle track add
	document.querySelector('.track__new a').addEventListener('click', function(e) {
		e.preventDefault();
		
		TracksManager.add({
			file: SoundsManager.files[0]
		});

	});

});

/*
 *	1. Metronome control binding
 * 	- play (starts or resumes the metronome)
 * 	- stop (stops and resets the metronome)
 *	- pause (stops the metronome, holds the position)
 */

// append playing state to parent
document.querySelector('.play-controls').dataset.playing = false;

// bindings for the metronome play control
document.querySelector('.play-controls .play > a').addEventListener('click', function(e) {
	e.preventDefault();
	var parent = this.parentNode.parentNode;
	var isPlaying = parent.dataset.playing.bool();

	if(!isPlaying) {
		parent.classList.add('is-playing');
		parent.dataset.playing = true;
		Metronome.start();
	} else {
		parent.classList.remove('is-playing');
		parent.dataset.playing = false;
		Metronome.pause();
	}
});

// bindings for the metronome stop control
document.querySelector('.play-controls .stop > a').addEventListener('click', function(e) {
	e.preventDefault();
	var parent = this.parentNode.parentNode;
	Metronome.stop();
	parent.classList.remove('is-playing');
	parent.dataset.playing = false;
});

/*
 *	2. Metrone tick callback declaration
 * 	- Override the Metronome tick method to process every tick
 */
Metronome.tick = function() {

	var current = this.currentTick;

	TracksManager.each(function(track) {

		var sample = track.dom.querySelector('audio');
		sample.pause();
		sample.currentTime = 0;

		track.dom.querySelectorAll('.beatpad .beatpad__pad').forEach(function(pad, i) {
			pad.classList.remove('current-step');
			if(i == current) {
				pad.classList.add('current-step');
				if(pad.classList.contains('active')) {
					if(!track.muted) sample.play();
				}
			}
		});

	});
	
}

// set current step to first iteration
Metronome.tick();

/*
 *	3. Keyboard listeners
 */
window.addEventListener('keyup', function(e) {

	switch(e.keyCode) {
		case 32:
			document.querySelector('.play-controls .play a').click();
		break;
		case 78:
			document.querySelector('.track__new a').click();
		break;
	}

});
