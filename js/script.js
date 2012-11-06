/* Author: Andrew Greig, 2012 */

// Get album art
// http://stackoverflow.com/questions/11877392/using-shoutcast-display-now-playing-album-art

var app = app || {};

app.path = "assets/12 Everything Resolves.mp3";

// app.audio.play(); - This will play the music.
// app.audio.pause(); - This will stop the music.
// app.audio.duration; - Returns the length of the music track.
// app.audio.currentTime = 0; - This will rewind the audio to the beginning.
// app.audio.loop = true; - This will make the audio track loop.
// app.audio.muted = true; - This will mute the track

// Site Core
app.player = (function(doc, $, undefined) {
	
	var 

	button = {},
	data = {},

	// Initialise the site
	init = function(){
		createAudio();
		bindings();
	},

	createAudio = function(){

		app.audio = new Audio(app.path);
		// elements
		button.play = $('#action_play');
		button.progress = $('.progress');
		// Set data 
		var offset = button.progress.offset();
        data.centerX = (offset.left) + (button.progress.width()/2);
        data.centerY = (offset.top) + (button.progress.height()/2);
	},

	bindings = function(){

		// play / pause
		button.play.on('click', function(e) {
			var $this = $(this);
			if ($this.is('.playing')) {
				app.player.pause();
			} else {
				app.player.play();
			}
			e.preventDefault();
		});

		// seeker
		button.progress.on('mousedown', function(e){
			var x, y, r;
			if (e.targetTouches) {
				x = e.targetTouches[0].pageX;
				y = e.targetTouches[0].pageY;
			} else {
				x = e.clientX;
				y = e.clientY;
			}
			r = rotation(x,y);
			updateProgress(r);
			changeTime(r/360*100);
		});

		button.progress.on('touchmove', function(e) {
			var x, y, r;
			x = e.targetTouches[0].pageX;
			y = e.targetTouches[0].pageY;
			r = rotation(x,y);
			updateProgress(r);
			changeTime(r/360*100);
		}, false);

		// update bar onchange
		app.audio.addEventListener('timeupdate',function (){
			var curtime = app.audio.currentTime,
				percent = (curtime/app.audio.duration)*100,
				rounded = Math.round(percent*1000)/1000,
				deg = 360/100*percent;
			updateProgress(deg);
		});

		// when the audio has finished playing
		app.audio.addEventListener('ended', function(){
			app.player.pause();
			//app.audio.currentTime = 0;
		});

	},

	// play action
	play = function(){
		app.audio.play();
		button.play.addClass('playing');
		button.play.text('Pause');
	},

	// pause action
	pause = function(){
		app.audio.pause();
		button.play.removeClass('playing');
		button.play.text('Play');
	},

	// change seeked time
	changeTime = function(percent){
		var t = (app.audio.duration*percent)/100;
		app.audio.currentTime = t;
	}

	updateProgress = function(deg){
		
		var $slice = $('.slice');

		if (deg > 180 && !$slice.is('.gt50')) {
			$slice.addClass('gt50');
			$slice.append('<div class="pie fill"></div>');
		} else if (deg < 180 && $slice.is('.gt50')) {
			$slice.removeClass('gt50');
			$slice.find('.fill').remove();
		}

		$slice.find('.pie').css({
			'-moz-transform':'rotate('+deg+'deg)',
			'-webkit-transform':'rotate('+deg+'deg)',
			'-o-transform':'rotate('+deg+'deg)',
			'transform':'rotate('+deg+'deg)'
		});

	},

	rotation = function(x,y){
		var radians = Math.atan2(x - data.centerX, y - data.centerY);
		var degree = Math.round( (radians * (180 / Math.PI) * -1) + 180 );
		return degree;
		//return (degree <= max ? degree : max);
	} 

	return {
		run: init,
		play: play,
		pause: pause
	};
	
})(document, Zepto);

app.player.run();


