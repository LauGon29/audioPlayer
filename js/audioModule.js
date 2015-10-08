
(function(window, undefined){
	
	var audio = undefined;
	var loop = false;
	var volumeValue = 0.5;
	var durationElement = undefined;
	var currentTimeElement = undefined;

	function init(){
		audio = document.createElement('audio');
		audio.setAttribute('src', '/music/song1.mp3');
		audio.durationchange = duration;
		audio.volume = volumeValue; // 50%

		durationElement = document.getElementById('duration');
		currentTimeElement= document.getElementById('currentTime');

		// audio events
		audio.addEventListener('durationchange', setDuration);
		audio.addEventListener('timeupdate',setCurrentTime);
		
		setCurrentTime();
	}

	function play(){
		audio.play();
	};

	function pause(){
		audio.pause();
	};

	function repeat(button){
		loop = !loop;
		if(loop){
			audio.setAttribute('loop', '');
			button.classList.add('active');
		}else{
			audio.removeAttribute('loop');
			button.classList.remove('active');
		}
	};

	function volume(plus){
		if(plus){
			volumeValue += 0.1
		}else{
			volumeValue -= 0.1
		}
		if(volumeValue > 1){
			volumeValue = 1;
		}else if(volumeValue < 0){
			volumeValue = 0;
		}
		audio.volume = volumeValue;
	};

	function setDuration(){
		durationElement.innerHTML = Math.floor(audio.duration);
	};

	function setCurrentTime(){
		currentTimeElement.innerHTML = Math.floor(audio.currentTime*1000);
	}

	// Javascript Class using Revealing Module Pattern
	window.Player = function(){
		
		init();

		// Revealing Module Pattern
		return {
			play: 	play,
			pause: 	pause,
			repeat: repeat,
			volume: volume,
		};
	}

})(window, undefined);