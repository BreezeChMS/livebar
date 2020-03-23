var livebar = function () { // wrap in function to avoid conflicts

	// styling
	var backgroundColor = document.currentScript.getAttribute('data-background-color');
	var buttonColor = document.currentScript.getAttribute('data-button-color');
	var buttonTextColor = document.currentScript.getAttribute('data-button-text-color');
	var textColor = document.currentScript.getAttribute('data-text-color');
	var layout = document.currentScript.getAttribute('data-layout'); if (!layout) { layout = 'header'; } // default to header

	// content
	var buttonText = document.currentScript.getAttribute('data-button-text');
	var headerText = document.currentScript.getAttribute('data-header-text');
	var dismissable = document.currentScript.getAttribute('data-dismissable');

	// timing & links
	var liveUrl = document.currentScript.getAttribute('data-live-url');
	if (!liveUrl) { liveUrl = 'https://livebar.church/no-url.html'; }
	var timezone = document.currentScript.getAttribute('data-timezone');

	// service 1
	var service1DayOfWeek = parseInt(document.currentScript.getAttribute('data-service-1-day-of-week'));
	var service1Hours = document.currentScript.getAttribute('data-service-1-hours');
	var service1Minutes = document.currentScript.getAttribute('data-service-1-minutes');
	var service1DurationMinutes = document.currentScript.getAttribute('data-service-1-duration-minutes');

	// service 2
	var service2DayOfWeek = parseInt(document.currentScript.getAttribute('data-service-2-day-of-week'));
	var service2Hours = document.currentScript.getAttribute('data-service-2-hours');
	var service2Minutes = document.currentScript.getAttribute('data-service-2-minutes');
	var service2DurationMinutes = document.currentScript.getAttribute('data-service-2-duration-minutes');

	// additional variables
	var completeThresholdMinutes = 5;
	var loadLivebarImmediately = document.currentScript.getAttribute('data-load-livebar-immediately');

	// define style
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = `
		.livebar-colors { 
			color: ${textColor};
			background: ${backgroundColor};
		}
		.livebar-header { 
			padding: 20px;
		    z-index: 1000;
		}
		.livebar-close {
			font-weight: 700;
			font-family: Tahoma;
			cursor: pointer;
		}
		.livebar-header .livebar-text { 
			padding: 10px;
			float: left;
		}
		.livebar-header .livebar-button { 
			float: right;
		}
		.livebar-header .livebar-close {
			padding: 10px 14px;
			float: right;
		}
		.livebar-sidebar .livebar-close {
		    position: absolute;
		    right: 10px;
		    top: 10px;
		    font-size: 12px;
		}
		.livebar-header .livebar-close:hover {
			filter: brightness(150%);
		}
		.livebar-sidebar .livebar-text {
			padding: 0px 0px 10px 0px;
			max-width: 200px;
		}
		.livebar-sidebar .livebar-button { 
		    display: block;
		    text-align: center;
		}
		.livebar-sidebar { 
			position: fixed;
			top: 100px;
			right:0;
			padding: 20px;
			-webkit-transition-duration: 0.3s;
			-moz-transition-duration: 0.3s;
			-o-transition-duration: 0.3s;
			transition-duration: 0.3s;
			border-top-left-radius: 7px;
			border-bottom-left-radius: 7px;
		    z-index: 1000;
		}
		.livebar-text { 
			font-size: 16px;
			font-weight: 500;
			font-family: 'Helvetica', 'Arial';
			color: ${textColor} !important;
		}	
		.livebar-button { 
			padding: 10px 20px;
			background: ${buttonColor};
			border-radius: 5px;
			color: ${buttonTextColor} !important;
		    font-size: 15px;
		    text-decoration: none;
		    font-family: 'Helvetica', 'Arial';
		}	
		.livebar-button:hover { 
			filter: brightness(85%);
			color: ${buttonTextColor} !important;
			text-decoration: none;
		}

		@media only screen and (max-width: 800px) {
			.livebar-header .livebar-close {
			    position: absolute;
			    right: 10px;
			    top: 10px;
			    font-size: 12px;
			}
			.livebar-header .livebar-text {
				float: none;
				text-align: center;
			}
			.livebar-header .livebar-button { 
				float: none;
				display: block;
				text-align: center;
			}
			.livebar-sidebar {
				position: fixed;
				left: 0;
				bottom: 0;
				width: 100%;
				text-align: center;
				top: initial;
				border-radius: 0px;
				padding: 0px;
			}
			.livebar-sidebar .livebar-text {
				float: none;
				width: 100%;
				max-width: 100%;
				padding: 20px 20px 0px 20px;
			}
			.livebar-sidebar .livebar-button { 
				float: none;
				display: block;
				text-align: center;
				margin: 20px;
			}

		}

	`;

	// when loaded
	document.addEventListener("DOMContentLoaded", function(){
		loadLivebar();
	});

	function loadLivebar() {

		// if existing livebar, don't load
		var existingLivebar = document.getElementsByTagName('livebar_container');
		if (existingLivebar.length > 0) { return false; }

		// head and body containers
		var livebarHead = document.getElementsByTagName('head')[0];
		var livebarBody = document.getElementsByTagName('body')[0];


		// add style to head
		livebarHead.appendChild(style);

		// create livebar and add class to it
		var livebarBar = document.createElement('div');
		livebarBar.classList.add("livebar_container");
		livebarBar.classList.add("livebar-colors");

		// select layout
		if (layout == 'sidebar') {
			livebarBar.classList.add("livebar-sidebar");
		} else {
			livebarBar.classList.add("livebar-header");
		}

		// add content to livebar
		livebarBar.innerHTML += `
								<div class="livebar-text">
									${headerText}
								</div>

								<div>
								`;

		if (dismissable == 'yes') {

			livebarBar.innerHTML += `
										<div class="livebar-close">
											&#x2715;
										</div>
										`;
		}

		livebarBar.innerHTML += `
									<a href="${liveUrl}" target="_blank" class="livebar-button" id="button-text">
										...
									</a>
								</div>
								<div style="clear: both;"></div>
								`;

		// prepend livebar to body
		livebarBody.insertBefore(livebarBar, livebarBody.firstChild);

		// now that the container is added, fetch it
		var timerCountdownContainer = document.getElementById("button-text");

		// listen for close
		if (dismissable == 'yes') {
			var livebarClose = document.getElementsByClassName("livebar-close");
			livebarClose[0].addEventListener('click', function(e) {
				
				var livebar_container = document.getElementsByClassName("livebar_container");
				livebar_container[0].style.display = 'none';

			});
		}

		// update the container every 1 second
		var timerCountdown = setInterval(function() {

		  timerCountdownContainer.innerHTML = getCountdownString();

		}, 1000);

		trackLivebarUsage('loaded');

	}

	function trackLivebarUsage(action) {

		var domain = window.location.hostname;

		if (domain && action && domain != 'livebar.church') {
			var http = new XMLHttpRequest();
			var url = 'https://app.breezechms.com/livebar/ping';
			var params = 'domain=' + domain + '&action=' + action;
			http.open('POST', url, true);		
			http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); //Send the proper header information along with the request
			http.send(params);
		}

	}

	// determines how much time is left or has elapsed relative to `countDownDate`
	function getCountdownTime(countDownDate) {

		// Get today's date and time
		var now = new Date().getTime();

		// if counting down
		if (countDownDate > now) {
			var distance = countDownDate - now;
		// if counting up
		} else {
			var distance = now - countDownDate;
		}

		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		// format output and exclude portions of date that aren't needed
		var countdownString = '';
		if (days) { countdownString += days + "d "; }
		if (hours || days) { countdownString += hours + "h "; }
		if (minutes || hours || days) { countdownString += minutes + "m "; }
		countdownString += seconds + "s ";

		return countdownString;

	}

	function getCountdownDataForService(dayOfWeek, hours, minutes, duration) {

		// get now
		var now = new Date();

		// define default view
		var view = "countdown";

		// get next service start time
		var nextServiceTimeStarts = new Date();
		nextServiceTimeStarts.setDate(nextServiceTimeStarts.getDate() + (dayOfWeek + 7 - nextServiceTimeStarts.getDay()) % 7);
		nextServiceTimeStarts.setHours(hours,minutes,00);

		// get next service end time
		var nextServiceTimeEnds = new Date(nextServiceTimeStarts.getTime() + duration*60000);

		// get time since service ended
		var serviceEndedMinutesAgo = ((now.getTime() - nextServiceTimeEnds.getTime()) / 1000) / 60;

		// if now is past the service end time
		if (now.getTime() > nextServiceTimeEnds.getTime()) {

			// if it's within x minutes, show complete
			if (serviceEndedMinutesAgo < completeThresholdMinutes) {

				view = "complete";

			// otherwise jump forward a week and show next countdown
			} else {

				view = "countdown";

				// get next service start time
				nextServiceTimeStarts = new Date(nextServiceTimeStarts.getTime() + 24 * (60000 * 60)); // jump forward 24 hours and then recalculate based on next day
				nextServiceTimeStarts.setDate(nextServiceTimeStarts.getDate() + (dayOfWeek + 7 - nextServiceTimeStarts.getDay()) % 7);
				nextServiceTimeStarts.setHours(hours,minutes,00);

			}

		// if now is before end of service, show live
		} else if (now.getTime() > nextServiceTimeStarts.getTime()) {
			view = "live";

		// default to countdown
		} else {
			view = "countdown";
		}

		var response = {};
		response.view = view;
		response.nextServiceTimeStarts = nextServiceTimeStarts;
		response.nextServiceTimeEnds = nextServiceTimeEnds;
		response.timeUntilStart = nextServiceTimeStarts.getTime() - now.getTime();

		return response;

	}

	function pickMostRelevantService(services) {

		// if only one service, return it
		if (services.length == 1) {
			return services[1];
		}

		// for each service, if a service is live, return it as live trumps all
		for (index = 0; index < services.length; index++) { 

		  	if (services[index].view == 'live') {
		  		return services[index];
		  	}

		}

		// get next service to start
		var nextServiceTimeToStart = 999999999999999999999999999999999999; // default to really high number that's greater than time to next service time
		var nextService = services[0]; // default to first

		// for each service, if a service is complete, return it
		for (index = 0; index < services.length; index++) { 

		  	if (services[index].view == 'complete') {
		  		return services[index];
		  	}

		  	// keep track of what is the next service to start
		  	if (services[index].timeUntilStart < nextServiceTimeToStart) {
		  		nextService = services[index];
		  		nextServiceTimeToStart = services[index].timeUntilStart;
		  	}

		}

		// default to next service to start
		return nextService;

	}

	function getCountdownString() {

		var services = [];
		services.push(getCountdownDataForService(service1DayOfWeek, service1Hours, service1Minutes, service1DurationMinutes));
		services.push(getCountdownDataForService(service2DayOfWeek, service2Hours, service2Minutes, service2DurationMinutes));

		var service = pickMostRelevantService(services);

		// show output depending on view
		switch (service.view) {

			case "countdown": // service has not yet started
				return buttonText + " " + getCountdownTime(service.nextServiceTimeStarts.getTime());
				break;

			case "complete": // service recently completed
				return "Live Finished " + getCountdownTime(service.nextServiceTimeEnds.getTime()) + " Ago";
				break;

			case "live": // service is live
				return "Live Now (+" + getCountdownTime(service.nextServiceTimeStarts.getTime()) + ")";
				break;

		}

	}

	if (loadLivebarImmediately == 'yes') {
		loadLivebar();
	}

}();