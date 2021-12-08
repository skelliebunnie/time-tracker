//main.js file
const CLOCK = document.querySelector("#clock");

const DOTS_CONTAINER = document.querySelector("#dotsContainer");

const LINE_CONTAINER = document.querySelector("#lineContainer");
const LINE = document.querySelector("#line");

const CIRCLE_CONTAINER = document.querySelector("#circleContainer");
const CIRCLE = document.querySelector("#circleContainer .circle");
const FILL_CIRCLE = document.querySelector("#circleContainer .fill-circle");

const clockContainer = document.querySelector("#clock_container");
const timersContainer = document.querySelector("#timers_container");

let clockSize = { 
	width: clockContainer.clientWidth, 
	height: clockContainer.clientHeight,
	circle: clockContainer.clientWidth - 40,
	radius: (clockContainer.clientWidth - 40) / 2
};

let OPTIONS = {};

let CLOCK_INTERVAL = setInterval(showClockTime, 1000);
let TIMER_INTERVALS = {};
let TIME_ENTRIES = {};

let storedTimers = localStorage.getItem('timers') ? JSON.parse(localStorage.getItem('timers')) : null;

updateOptions();
addDots();
setCircle();
updateLayout();
updateClockDisplay();

function updateClockSize() {
	clockSize = {
		width: clockContainer.clientWidth,
		height: clockContainer.clientWidth,
		circle: clockContainer.clientWidth - 40,
		radius: (clockContainer.clientWidth / 4) - 40
	}
}

// http://jsfiddle.net/ThiefMaster/LPh33/4/
// for arranging dots in a circle
function addDots() {
	while(DOTS_CONTAINER.firstChild) {
		DOTS_CONTAINER.removeChild(DOTS_CONTAINER.firstChild);
	}

	var radius = clockSize.radius / 3;

  var width = clockSize.width,
      height = width,
      angle = 0,
      step = (2*Math.PI) / 59;

	for(var i = 1; i <= 59; i++) {
		let dot = document.createElement('i');
		dot.classList.add("dot", `dot-${i}`, "far", "fa-circle", "text-xxs", "md:text-xs", "m-0.5", "text-accent-500", "absolute");
		dot.setAttribute("data-idx", i);

		var dotWidth = window.innerWidth < 640 ? 8 : 12, dotHeight = dotWidth;
    var x = Math.round((radius * 2) * Math.cos(angle) - dotWidth/2);
    var y = Math.round((radius * 2) * Math.sin(angle) - dotHeight/2);

    dot.style.top = `${y}px`;
    dot.style.left = `${x}px`;

    angle += step;

		DOTS_CONTAINER.appendChild(dot);
	}
}

function setCircle() {
	var size = clockSize.circle,
			containerWidth = clockSize.width,
			containerHeight = clockSize.height,
			circleRadius = clockSize.radius / 1.5,
			loadingSize = 0,
			strokeWidth = size * 0.05;

	CIRCLE_CONTAINER.style.width = `${containerWidth}px`;
	CIRCLE_CONTAINER.style.height = `${containerHeight}px`;

	document.querySelectorAll(".circle").forEach(circle => {
		circle.setAttribute('cy', containerHeight / 2);
		circle.setAttribute('cx', containerWidth / 2);
		circle.setAttribute('r', circleRadius);

		circle.style.strokeWidth = strokeWidth;
	});

	FILL_CIRCLE.style.strokeDasharray = size * 3;
	FILL_CIRCLE.style.strokeDashoffset = size * 3;

	updateCircle();
}

function updateCircle(sec=null) {
	if(sec === null) {
		let dt = new Date();
		sec = dt.getSeconds();
	}

	var offset = clockSize.circle * 3;

	FILL_CIRCLE.style.strokeDashoffset = offset - (offset * (sec / 85));
}

function localTimers(action) {
	let res;

	if(action === "get") {
		res = localStorage.getItem('timers') !== undefined ? JSON.parse(localStorage.getItem('timers')) : { message: 'no timers found' };
	}

	if(action === "set" || action === "save") {
		localStorage.setItem('timers', JSON.stringify(TIMER_INTERVALS));
		res = { message: 'saved timers' };
	}

	if(action === "clear") {
		localStorage.removeItem('timers');
		res = { message: 'timers removed' };
	}

	return res;
}

function localTimeEntries(action) {
	let res;

	if(action === "get") {
		res = localStorage.getItem('time_entries') !== undefined ? JSON.parse(localStorage.getItem('time_entries')) : { message: 'no time_entries found' };
	}

	if(action === "set" || action === "save") {
		localStorage.setItem('time_entries', JSON.stringify(TIME_ENTRIES));
		res = { message: 'saved time entries' };
	}

	if(action === "clear") {
		localStorage.removeItem('time_entries');
		res = { message: 'timers removed' };
	}

	return res;
}

function updateOptions() {
	let storedOptions = localStorage.getItem('timer_options') !== undefined ? JSON.parse(localStorage.getItem('timer_options')) : null;
	
	const currentOptions = {
		show_seconds: document.querySelector("[name='show_seconds']").checked,
		sec_numbers: document.querySelector("[name='sec_numbers']").checked,
		seconds_display: document.querySelector("[name='seconds_display']").value,
		hr24: document.querySelector("[name='hr24']").checked,
		clock_right: document.querySelector("[name='clock_right']").checked
	};

	if(OPTIONS.show_seconds === undefined && storedOptions !== null) {
		OPTIONS = storedOptions;

	} else {
		OPTIONS = currentOptions;
	}

	localStorage.setItem('timer_options', JSON.stringify(OPTIONS));

	Object.keys(OPTIONS).forEach(key => {
		if(key !== 'seconds_display') {
			if(OPTIONS[key]) {
				document.querySelector(`[name="${key}"]`).setAttribute("checked", true);
			} else {
				document.querySelector(`[name="${key}"]`).removeAttribute("checked");
			}
		}
	});

	updateLayout();
	updateClockDisplay();
}

function updateLayout() {
	// clock_right == place-bottom on mobile (< 640)
	if(OPTIONS.clock_right) {
		clockContainer.classList.remove("place-top", "md:place-left");
		clockContainer.classList.add("place-bottom", "md:place-right");

		timersContainer.classList.remove("place-bottom", "md:place-right");
		timersContainer.classList.add("place-top", "md:place-left");

	} else {
		clockContainer.classList.remove("place-bottom", "md:place-right");
		clockContainer.classList.add("place-top", "md:place-left");

		timersContainer.classList.remove("place-top", "md:place-left");
		timersContainer.classList.add("place-bottom", "md:place-right");
	}
}

function updateClockDisplay() {
	document.querySelector("#seconds_display").classList.add("hidden");

	DOTS_CONTAINER.classList.add('hidden');
	LINE_CONTAINER.classList.add('hidden');
	CIRCLE_CONTAINER.classList.add('hidden');

	if(OPTIONS.show_seconds) {
		document.querySelector("#seconds_display").classList.remove("hidden");

		const type = OPTIONS.seconds_display;

		if(type === 'dots') {
			DOTS_CONTAINER.classList.remove('hidden');

			LINE_CONTAINER.classList.add('hidden');
			CIRCLE_CONTAINER.classList.add('hidden');

		} else if(type === 'line') {
			LINE_CONTAINER.classList.remove('hidden');

			DOTS_CONTAINER.classList.add('hidden');
			CIRCLE_CONTAINER.classList.add('hidden');

		} else if(type === 'circle') {
			LINE_CONTAINER.classList.add('hidden');
			DOTS_CONTAINER.classList.add('hidden');

			CIRCLE_CONTAINER.classList.remove('hidden');
			setCircle();

		} else {
			DOTS_CONTAINER.classList.add('hidden');
			LINE_CONTAINER.classList.add('hidden');
			CIRCLE_CONTAINER.classList.add('hidden');

		}

	}
}

function updateTitle(idx, title) {
	TIMER_INTERVALS[idx].title = title;

	localTimers('save');
}

function formatDateTime(data, dateTime=false, getDate=false, string=false) {
	let timeString = '', dateString = '';
	let hour, minute, second, year, month, date;

	if(data.h !== undefined) {
		hour = data.h >= 10 ? data.h : `0${data.h}`;
		minute = data.m >= 10 ? data.m : `0${data.m}`;
		second = data.s >= 10 ? data.s : `0${data.s}`;

		timeString = `${hour}:${minute}:${second}`;
	}

	if(getDate) {
		d = new Date();
		data.y = d.getFullYear();
		data.n = d.getMonth() + 1,
		data.d = d.getDate();
	}

	if(data.y !== undefined) {
		year = data.y;
		month = data.n >= 10 ? data.n : `0${data.n}`;
		date = data.d >= 10 ? data.d : `0${data.d}`;

		dateString = `${year}-${month}-${date}`;
	}

	if(string) {
		if(dateTime) {
			return `${dateString} ${timeString}`;

		} else if(data.h !== undefined) {
			return timeString;

		} else if(data.y !== undefined) {
			return dateString;

		} else {
			return JSON.stringify(data);

		}

	} else {
		if(dateTime) {
			return { hour, minute, second, year, month, date };

		} else if(data.h !== undefined) {
			return { hour, minute, second };

		} else if(data.y !== undefined) {
			return { year, month, date };

		} else {
			return data;

		}

	}
}

/**
 * INTERVAL FUNCTIONS
 */
function showClockTime() {
	let time = new Date();

	let hour = time.getHours();
	let min = time.getMinutes();
	let sec = time.getSeconds();

	let am_pm = hour > 12 ? "PM" : "AM";
	if(hour > 12 && !OPTIONS.hr24) hour -= 12;

	var h = hour < 10 ? "0" + hour : hour,
			m = min < 10 ? "0" + min : min;
			s = sec < 10 ? "0" + sec : sec;

	let currentTime = `${h}:${m}`;
	if(OPTIONS.show_seconds && OPTIONS.sec_numbers) {
		currentTime += `:${s}`;

	}
	if(!OPTIONS.hr24) currentTime += ` ${am_pm}`;

	if(OPTIONS.show_seconds && OPTIONS.seconds_display === 'dots') {
		// DOTS_CONTAINER.innerHTML = Array(sec < 59 ? sec + 1 : 1).fill(dot).join("");

		DOTS_CONTAINER.querySelectorAll('.dot').forEach(dot => {
			if(sec === 0) {
				dot.classList.add('far');
				dot.classList.remove('fas');

			} else if(parseInt(dot.dataset.idx) <= sec) {
				dot.classList.remove('far');
				dot.classList.add('fas');

			}

			
		});

	}

	if(OPTIONS.show_seconds && OPTIONS.seconds_display === 'line') {
		let width = (sec / 59) * 100;
		LINE.style.width = `${width}%`;
	}

	if(OPTIONS.show_seconds && OPTIONS.seconds_display === 'circle') {
		updateCircle(sec);
	}

	CLOCK.innerText = currentTime;
	if(clockSize.width !== clockContainer.clientWidth) {
		updateSecondsDisplay();
	}
}

function updateSecondsDisplay() {
	updateClockSize();

	if(OPTIONS.seconds_display === 'dots') {
		addDots();

	} else if(OPTIONS.seconds_display === 'circle') {
		setCircle();

	}
}

function showTimerTime(target, idx) {
	let time = TIMER_INTERVALS[idx];

	if(time.s < 59) {
		time.s++;
	} else if(time.s >= 59 && time.m < 59) {
		time.s = 0;
		time.m++;
	} else if(time.s >= 59 && time.m >= 59) {
		time.s = 0;
		time.m = 0;
		time.h++
	}

	let res = formatDateTime(time);

	TIMER_INTERVALS[idx] = {
		...TIMER_INTERVALS[idx],
		...time
	}

	localTimers('save');

	target.innerText = `${res.hour}:${res.minute}:${res.second}`;
}

/**
 * CLICK HANDLERS
 */
// handle restarting the clock when changing inputs
document.querySelectorAll("input.opt-input").forEach(item => {
		item.addEventListener('click', function() {
			updateOptions();
			
			if(item.name === 'clock_right') {
				updateLayout(item.value);

			} else {
				updateClockDisplay();

				clearInterval(CLOCK_INTERVAL);
				CLOCK_INTERVAL = setInterval(showClockTime, 1000);
			}

		});
});

document.querySelector("#seconds_display").addEventListener('change', (e) => {
	updateOptions();
});

document.querySelectorAll(".timer").forEach(timer => {
	const playPauseBtn = timer.querySelector(".play-pause > i");
	const form = timer.querySelector("form");

	const storedTimers = localTimers('get');

	let clearTimeBtn = timer.querySelector(".clear-time");
	let saveTimeBtn = timer.querySelector(".save-time");

	let idx = parseInt(timer.dataset['idx']);
	let timeContainer = timer.querySelector(".time");
	let title = timer.querySelector("[name='title']").value;

	TIMER_INTERVALS[idx] = {
		title,
		h: 0,
		m: 0,
		s: 0,
		interval: null
	};

	TIME_ENTRIES[idx] = {
		title,
		h: 0,
		m: 0,
		s: 0,
		date: formatDateTime({}, true, true, true)
	}

	if(storedTimers !== null && !storedTimers.message && storedTimers[idx]) {
		TIMER_INTERVALS[idx] = {
			...storedTimers[idx],
			interval: null
		};

		title = TIMER_INTERVALS[idx].title;
	} else {
		localTimers('save');

	}

	if(timer.querySelector("[name='title']").value !== title) {
		timer.querySelector("[name='title']").value = title;
	}

	if(TIMER_INTERVALS[idx].h > 0 || TIMER_INTERVALS[idx].m > 0 || TIMER_INTERVALS[idx].s > 0) {
		clearTimeBtn.classList.remove("disabled");
		saveTimeBtn.classList.remove("disabled");
	}

	const formattedTime = formatDateTime(TIMER_INTERVALS[idx], false, false, true);
	timeContainer.innerText = formattedTime;

	playPauseBtn.addEventListener("click", function() {

		const playing = playPauseBtn.dataset.playing;

		if(playing === "true") {
			playPauseBtn.dataset.playing = "false";
			playPauseBtn.classList.add("fa-play-circle");
			playPauseBtn.classList.remove("fa-pause-circle");

			clearInterval(TIMER_INTERVALS[idx].interval);

		} else {
			playPauseBtn.dataset.playing = "true";
			playPauseBtn.classList.remove("fa-play-circle");
			playPauseBtn.classList.add("fa-pause-circle");

			TIMER_INTERVALS[idx].interval = setInterval(function() {
					showTimerTime(timeContainer, idx, TIMER_INTERVALS[idx]);
				}, 1000);

			clearTimeBtn.classList.remove("disabled");
			saveTimeBtn.classList.remove("disabled");
		}
	});

	clearTimeBtn.addEventListener("click", function() {
		if(!clearTimeBtn.classList.contains("disabled")) {
			playPauseBtn.dataset.playing = false;
			playPauseBtn.classList.remove("fa-pause-circle");
			playPauseBtn.classList.add("fa-play-circle");

			clearInterval(TIMER_INTERVALS[idx].interval);

			TIMER_INTERVALS[idx] = {
				...TIMER_INTERVALS[idx],
				h: 0,
				m: 0,
				s: 0,
				interval: null
			};
			timeContainer.innerText = formatDateTime(TIMER_INTERVALS[idx], false, false, true);

			localTimers('save');

			clearTimeBtn.classList.add("disabled");
			saveTimeBtn.classList.add("disabled");
		}
	});

	saveTimeBtn.addEventListener("click", function() {
		if(!saveTimeBtn.classList.contains("disabled")) {
			playPauseBtn.dataset.playing = false;
			playPauseBtn.classList.remove("fa-pause-circle");
			playPauseBtn.classList.add("fa-play-circle");

			clearInterval(TIMER_INTERVALS[idx].interval);

			TIMER_INTERVALS[idx] = {
				...TIMER_INTERVALS[idx],
				interval: null
			};
			timeContainer.innerText = formatDateTime(TIMER_INTERVALS[idx], false, false, true);

			TIME_ENTRIES[idx] = {
				...TIME_ENTRIES[idx],
				h: TIMER_INTERVALS[idx].h,
				m: TIMER_INTERVALS[idx].m,
				s: TIMER_INTERVALS[idx].s
			}

			localTimers('save');
			localTimeEntries('save');
		}
	});

	form.addEventListener("submit", function(e) {
		e.preventDefault();
		form.querySelector("input").blur();

		updateTitle(idx, e.target[0].value);
	});

	form.querySelector("input").addEventListener("blur", function(e) {
		updateTitle(idx, e.target.value);
	})
});

