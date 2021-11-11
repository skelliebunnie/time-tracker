//main.js file

const COUNTER = document.querySelector("#counter");
const LINE_CONTAINER = document.querySelector("#lineContainer");
const LINE = document.querySelector("#line");

const clockContainer = document.querySelector("#clock_container");
const timersContainer = document.querySelector("#timers_container");

const defaultOptions = {
	show_seconds: true,
	seconds_display: 'numbers',
	hr24: false,
	clock_right: false
};
let OPTIONS = {};

updateOptions();
updateLayout();
updateClockDisplay();

const CLOCK = document.querySelector("#clock");

let CLOCK_INTERVAL = setInterval(showClockTime, 1000);
let TIMER_INTERVALS = {};

let storedTimers = localStorage.getItem('timers') ? JSON.parse(localStorage.getItem('timers')) : null;

function localTimers(action) {
	let res;

	if(action === "get") {
		res = localStorage.getItem('timers') !== undefined ? JSON.parse(localStorage.getItem('timers')) : { message: 'no timers found' };
	}

	if(action === "set" || action === "save") {
		localStorage.setItem('timers', JSON.stringify(TIMER_INTERVALS));
		res = { message: 'complete' };
	}

	if(action === "clear") {
		localStorage.removeItem('timers');
		res = { message: 'timers removed' };
	}

	return res;
}

function updateOptions() {
	let storedOptions = localStorage.getItem('timer_options') !== undefined ? JSON.parse(localStorage.getItem('timer_options')) : null;

	if(OPTIONS.show_seconds !== undefined && OPTIONS !== defaultOptions) {
		console.log("user changing options");

		OPTIONS = {
			show_seconds: document.querySelector("[name='show_seconds']").checked,
			seconds_display: document.querySelector("[name='seconds_display']").value,
			hr24: document.querySelector("[name='hr24']").checked,
			clock_right: document.querySelector("[name='clockright']").checked
		};

		localStorage.setItem('timer_options', JSON.stringify(OPTIONS));

	} else if(storedOptions !== null) {
		console.log("loading from localStorage");
		OPTIONS = storedOptions;

	}

	document.querySelector("[name='seconds_display']").value = OPTIONS.seconds_display;
}

function updateLayout() {
	
	if(OPTIONS.clock_right) {
		clockContainer.classList.add("col-start-2");
		timersContainer.classList.add("col-start-1");
	}
}

function updateClockDisplay() {
	if(OPTIONS.show_seconds) {
		document.querySelector("#seconds_display").classList.remove("hidden");
	}

	if(OPTIONS.show_seconds && OPTIONS.seconds_display === 'dots') {
		COUNTER.classList.remove('hidden');

		LINE.style.width = 0;
		LINE_CONTAINER.classList.add("hidden");

	} else {
		COUNTER.classList.add('hidden');
	}

	if(OPTIONS.show_seconds && OPTIONS.seconds_display === 'line') {
		COUNTER.classList.add('hidden');
		LINE_CONTAINER.classList.remove("hidden");

	} else {
		LINE.style.width = 0;
		LINE_CONTAINER.classList.add("hidden");
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
	let iSec = time.getSeconds();

	let am_pm = hour > 12 ? "PM" : "AM";
	if(hour > 12 && !OPTIONS.hr24) hour -= 12;

	hour = hour < 10 ? "0" + hour : hour;
	min = min < 10 ? "0" + min : min;
	sec = sec < 10 ? "0" + sec : sec;

	let currentTime = `${hour}:${min}`;
	if(OPTIONS.show_seconds && OPTIONS.seconds_display === 'numbers') {
		currentTime += `:${sec}`;
	}
	if(!OPTIONS.hr24) currentTime += ` ${am_pm}`;

	if(OPTIONS.show_seconds && OPTIONS.seconds_display === 'dots') {
		let dot = '<i class="fas fa-circle fa-xs mx-0.5"></i>';
		COUNTER.innerHTML = Array(iSec < 59 ? iSec + 1 : 1).fill(dot).join("");
	}

	if(OPTIONS.show_seconds && OPTIONS.seconds_display === 'line') {
		let width = (iSec / 59) * 100;

		LINE.style.width = `${width}%`;
	}

	CLOCK.innerText = currentTime;
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

// handle restarting the clock when changing inputs
document.querySelectorAll(".opt-input").forEach(item => {
		item.addEventListener('click', function() {
			updateOptions();

			if(item.name === 'clockright') {
				updateLayout(item.value);

			} else {
				updateClockDisplay();

				clearInterval(CLOCK_INTERVAL);
				CLOCK_INTERVAL = setInterval(showClockTime, 1000);
			}

		});
});

document.querySelectorAll(".timer").forEach(timer => {
	const playPauseBtn = timer.querySelector(".play-pause > i");
	const form = timer.querySelector("form");

	const storedTimers = localTimers('get');

	let clearTimeBtn = timer.querySelector(".clear-time");

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

	if(!storedTimers.message && storedTimers[idx]) {
		TIMER_INTERVALS[idx] = {
			...storedTimers[idx],
			interval: null
		};

		title = TIMER_INTERVALS[idx].title;
	}

	if(timer.querySelector("[name='title']").value !== title) {
		timer.querySelector("[name='title']").value = title;
	}

	if(TIMER_INTERVALS[idx].h > 0 || TIMER_INTERVALS[idx].m > 0 || TIMER_INTERVALS[idx].s > 0) {
		clearTimeBtn.classList.remove("disabled");
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
		}
	});

	clearTimeBtn.addEventListener("click", function() {
		if(!clearTimeBtn.classList.contains("disabled")) {
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

