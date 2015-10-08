(function(window){
	var data;
	var audio = undefined;
	var currentSong = 0;
	var currentTimeElement = undefined;
	var durationElement = undefined;
	var fullList = document.getElementById('audioList');
	var listBtn = document.getElementById('listBtn');
	var loop = false;
	var mutebtn = document.getElementById("mutebtn");
	var pauseButton = document.getElementById("pause");
	var playButton = document.getElementById("play");
	var seekslider = document.getElementById("seekslider");
	var timeBar = document.getElementById('controlTime');
	var total= "";
	var volumeslider = document.getElementById("volumeslider");
	var volumeValue = 1;
	var currSongDuration;


	listBtn.addEventListener('click', hideMenu);
	mutebtn.addEventListener("click", mute);
	volumeslider.addEventListener("mousemove", changevolume);


	/*
		**Request JSON
	*/
	function callingJson() {
	    var xmlhttp;

	    if (window.XMLHttpRequest) {
	        // code for IE7+, Firefox, Chrome, Opera, Safari
	        xmlhttp = new XMLHttpRequest();
	    } else {
	        // code for IE6, IE5
	        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	    }

	    xmlhttp.onreadystatechange = function() {
	        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
	           if(xmlhttp.status == 200){
	           		data = JSON.parse(xmlhttp.responseText);
	           		showData(data);
	           		creatingSongs(data);
	           		next(data);
	           		previous(data);
	           		playSong(data);
	           }
	           else if(xmlhttp.status == 400) {
	              alert('There was an error 400')
	           }
	           else {
	               alert('something else other than 200 was returned')
	           }
	        }
	    }

	    xmlhttp.open("GET", "js/audio.json", true);
	    xmlhttp.send();
	}
	//callingJson();

	/*
		***creating dinamic audio
	*/
	function creatingSongs(data){
		audio = document.createElement('audio');
		audio.setAttribute('src', data.audios[currentSong].pista);
		audio.setAttribute('id', data.audios[currentSong].id);
		audio.volume = volumeValue; // 100%
		durationElement = document.getElementById('duration');
		currentTimeElement= document.getElementById('currentTime');	
		// audio events
		audio.addEventListener('durationchange', setDuration);
		audio.addEventListener('timeupdate',setCurrentTime);
		// setCurrentTime(audio.duration, true);
	}

	/*
		**Print audioList
	*/
	function showData(data){
		var content = document.getElementById('audioList');
		var list = "";
		for (var i = 0; i < data.audios.length; i++) {
			list += '<ul><li id="'+data.audios[i].id+'" class="songs"><img src="'+data.audios[i].image+'">'+'<div class="info"><p>'+data.audios[i].nameSong+'</p><p>'+data.audios[i].artist+'</p></div></li></ul>';
		};

		content.innerHTML = list;
	}

	/*
		**drawing currentSong
	*/
	function playSong(data){
		var contentSong = document.getElementById('playSong');
		var playSong = "";
			playSong += '<img id="'+data.audios[currentSong].id+'"src="'+data.audios[currentSong].image+'" class="mainCover"> <h3 class="titleSong">'+data.audios[currentSong].nameSong+'</h3><h4 class="titleArtist">'+data.audios[currentSong].artist+'</h4>';
	
		contentSong.innerHTML = playSong;
	}

	/* ***DRAWING CONTROLS*** */
	/*
		**Action Buttton: Play
	*/
	function play(){
		if(audio.paused){
		    audio.play();
		    playButton.style.visibility = "hidden";
			pauseButton.style.visibility = "visible";
	    } else {
		    audio.pause();
		    playButton.style.visibility = "visible";
			pauseButton.style.visibility = "hidden";
	    }
	}

	/*
		**Action Buttton: Pause
	*/
	function pause(){
		audio.pause();
	};

	/*
		**Action Buttton: Previous
	*/
	function previous(data){
		var previous = document.getElementById('previous');
		previous.onclick = function(){
			audio.setAttribute('src', data.audios[--currentSong].pista);
			audio.setAttribute('id', data.audios[currentSong].id);
			play();
			playSong(data);
		};
	}

	var goToNext = function(){
			audio.setAttribute('src', data.audios[++currentSong].pista);
			audio.setAttribute('id', data.audios[currentSong].id);
			play();
			playSong(data);		
	};

	/*
		**Action Buttton: Next
	*/
	function next(data){
		var next = document.getElementById('next');
		next.onclick = goToNext;
	}


	
	/* ***DRAWING CONTROLS VOL*** */
	/*
		**Action Bar
	*/
	function changevolume(){
		audio.volume = volumeslider.value / 100;
	}

	/*
		**Action Button: mute
	*/
	function mute(){
		if(audio.muted){
		    audio.muted = false;
		    volumeslider.value = 100;
	    } 
    else {
		    audio.muted = true;
		    volumeslider.value = 0;
	  }
	}


	/* ***TIME CONTROL*** */
	/*
		**Action Bar
	*/
	function setDuration(){
		var totalTime = Math.floor(audio.duration);
		return convertionTime(totalTime, true);
	};

	function setCurrentTime(){
		var current =  Math.floor(audio.currentTime);
		var c = convertionTime(current, false);
		if (c == currSongDuration){
			goToNext();
		}
	}

	function convertionTime (sec, isDuration){
		var minutes = Math.floor(sec/60);
		var sec = sec - minutes * 60;

    	if (sec < 10) {
      		sec = "0" + sec;
    	}

    	var time = minutes + ':' + sec;
    	var timeValue = audio.currentTime * (100 / audio.duration);
    	seekslider.value = timeValue;

    	if(isDuration){
    		durationElement.innerHTML = time;
    		currSongDuration = time;
    	}else{
    		currentTimeElement.innerHTML = time;
    	}
    	return time;
	}


	/*
		**Action Menu
	*/
	function hideMenu (estado) {
		if(fullList.style.display === 'block'){
			fullList.style.display = 'none';
		}
		else {
			fullList.style.display = 'block';
		}
	}

	/*
		**Select and play song from list
	*/
	function playSelect(){
		var songs = document.getElementsByTagName('li');
		console.log(typeof songs);
		var id = "";

		for (var key in songs){
			songs[key].onclick = function(){
				id = this.id;
			}
		};

	}playSelect();

	window.Player = function(){
			
		callingJson();
		// Revealing Module Pattern
		
		return {
			play:play,
			pause:pause,
			next:next,
			previous:previous,
			changevolume:changevolume,
			mute:mute,
			playSong: playSong,
			hideMenu: hideMenu,
			timeBar: timeBar,
			timeBar:timeBar,
			playSelect: playSelect,
		};
	}

	

})(window);

