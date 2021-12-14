const clockContainer = document.querySelector("#clock_container");
const timersContainer = document.querySelector("#timers_container");

/** CLOCK **/
const CLOCK = document.querySelector("#clock");

const DOTS_CONTAINER = document.querySelector("#dotsContainer");

const LINE_CONTAINER = document.querySelector("#lineContainer");
const LINE = document.querySelector("#line");

const CIRCLE_CONTAINER = document.querySelector("#circleContainer");
const CIRCLE = document.querySelector("#circleContainer .circle");
const FILL_CIRCLE = document.querySelector("#circleContainer .fill-circle");

let clockSize = { 
	width: clockContainer.clientWidth, 
	height: clockContainer.clientHeight,
	circle: clockContainer.clientWidth - 40,
	radius: (clockContainer.clientWidth - 40) / 2
};

let OPTIONS = {};

let CLOCK_INTERVAL = setInterval(showClockTime, 1000);

/** TIMERS **/
let TIMER_INTERVALS = {};
let storedTimers = localStorage.getItem('timers') ? JSON.parse(localStorage.getItem('timers')) : null;

/** TIME ENTRIES **/
let TIME_ENTRIES = {};
/**
 * GENERAL FUNCTIONS
 */

function getChildren(n, skipMe){
    var r = [];
    for ( ; n; n = n.nextSibling ) 
       if ( n.nodeType == 1 && n != skipMe)
          r.push( n );        
    return r;
};

function getSiblings(n) {
    return getChildren(n.parentNode.firstChild, n);
}
/**
 * TIMERS
 * idx: {
 *  title: "string",
 * 	start: <date>,
 * 	end: <date>,
 * 	interval: function()
 * }
 */
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

function updateTitle(idx, title) {
	TIMER_INTERVALS[idx].title = title;

	localTimers('save');
}

function showTimerTime(target, idx, update=false) {
	if(update) {
		let startTime = dayjs(TIMER_INTERVALS[idx].start);
		let currentTime = dayjs();
		let diff = currentTime.diff(startTime, 'second', true);

		let res = {
			h: Math.floor(diff / 3600),
			m: Math.floor(diff / 60 % 60),
			s: Math.floor(diff % 60)
		};

		TIMER_INTERVALS[idx] = {
			...TIMER_INTERVALS[idx],
			secondsElapsed: Math.floor(diff)
		}

		localTimers('save');

		target.innerText = `${padTime(res.h)}:${padTime(res.m)}:${padTime(res.s)}`;

	} else {
		const s = TIMER_INTERVALS[idx].secondsElapsed;
		let res = {
			h: Math.floor(s / 3600),
			m: Math.floor(s / 60 % 60),
			s: Math.floor(s % 60)
		};

		target.innerText = `${padTime(res.h)}:${padTime(res.m)}:${padTime(res.s)}`;
	}
}

function padTime(i) {
	if(i < 10) i = `0${i}`;
	return i;
}

/**
 * CLICK HANDLERS
 */
document.querySelectorAll(".timer").forEach(timer => {
	const playPauseBtn = timer.querySelector(".play-pause > i");
	const storedTimers = localTimers('get');
	const idx = parseInt(timer.dataset['idx']);

	let timeContainer = timer.querySelector(".time");
	let title = timer.querySelector("[name='title']").value;

	// set up Timer & Time Entry objects
	TIMER_INTERVALS[idx] = {
		title,
		interval: null,
		start: dayjs(),
		secondsElapsed: 0
	};

	TIME_ENTRIES[idx] = {
		title,
		date: dayjs().format('YYYY-MM-DD'),
		secondsElapsed: 0
	};

	// if there's a stored timer with the same ID, "merge" the data
	if(storedTimers !== null && !storedTimers.message && storedTimers[idx]) {
		TIMER_INTERVALS[idx] = {
			...storedTimers[idx],
			interval: null
		};

		title = TIMER_INTERVALS[idx].title;
	}

	localTimers('save');
	
	// set up for displaying "count-up" time
	showTimerTime(timeContainer, idx);

	// handle starting/stopping timer
	playPauseBtn.addEventListener("click", function() {

		const playing = playPauseBtn.dataset.playing;

		// if playing is true, then we need to PAUSE
		if(playing === "true") {
			playPauseBtn.dataset.playing = "false";
			playPauseBtn.classList.add("fa-play-circle");
			playPauseBtn.classList.remove("fa-pause-circle");

			clearInterval(TIMER_INTERVALS[idx].interval);

		} else {
			playPauseBtn.dataset.playing = "true";
			playPauseBtn.classList.remove("fa-play-circle");
			playPauseBtn.classList.add("fa-pause-circle");

			// reset "start" time for accurate counting after pause
			// subtracting secondsElapsed to continue count-up correctly
			TIMER_INTERVALS[idx].start = dayjs().subtract(TIMER_INTERVALS[idx].secondsElapsed, 'seconds');

			TIMER_INTERVALS[idx].interval = setInterval(function() {
					showTimerTime(timeContainer, idx, true);
				}, 500);

			let clearTimeBtn = timer.querySelector(".clear-time");
			let saveTimeBtn = timer.querySelector(".save-time");

			clearTimeBtn.classList.remove("disabled");
			saveTimeBtn.classList.remove("disabled");
		}
	});
});
/**
 * CLOCK FUNCTIONS
 */
updateOptions();
addDots();
setCircle();
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
		} else {
			document.querySelector("[name='seconds_display']").value = OPTIONS["seconds_display"];
		}
	});

	updateLayout();
	updateClockDisplay();
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
	const form = timer.querySelector("form");
	const idx = parseInt(timer.dataset['idx']);
	const storedTimers = localTimers('get');
	const playPauseBtn = timer.querySelector(".play-pause > i");

	let clearTimeBtn = timer.querySelector(".clear-time");
	let saveTimeBtn = timer.querySelector(".save-time");
	let title = timer.querySelector("[name='title']").value;

	let timeContainer = timer.querySelector(".time");

	// if there's a stored timer with the same ID, "merge" the data
	if(storedTimers !== null && !storedTimers.message && storedTimers[idx]) {
		TIMER_INTERVALS[idx] = {
			...storedTimers[idx],
			interval: null
		};

		title = TIMER_INTERVALS[idx].title;
	}

	// update title in input field
	if(timer.querySelector("[name='title']").value !== title) {
		timer.querySelector("[name='title']").value = title;
	}
	// disable save/clear buttons if at least one time is greater than 0
	if(TIMER_INTERVALS[idx].secondsElapsed > 0) {
		clearTimeBtn.classList.remove("disabled");
		saveTimeBtn.classList.remove("disabled");
	}

	// handle clearing timer "count-up"
	clearTimeBtn.addEventListener("click", function() {
		if(!clearTimeBtn.classList.contains("disabled")) {
			playPauseBtn.dataset.playing = false;
			playPauseBtn.classList.remove("fa-pause-circle");
			playPauseBtn.classList.add("fa-play-circle");

			clearInterval(TIMER_INTERVALS[idx].interval);

			TIMER_INTERVALS[idx] = {
				...TIMER_INTERVALS[idx],
				interval: null,
				end: dayjs(),
				secondsElapsed: 0
			};
			timeContainer.innerText = "00:00:00";

			localTimers('save');

			clearTimeBtn.classList.add("disabled");
			saveTimeBtn.classList.add("disabled");
		}
	});

	// handle saving time as time entry
	saveTimeBtn.addEventListener("click", function() {
		if(!saveTimeBtn.classList.contains("disabled")) {
			playPauseBtn.dataset.playing = false;
			playPauseBtn.classList.remove("fa-pause-circle");
			playPauseBtn.classList.add("fa-play-circle");

			clearInterval(TIMER_INTERVALS[idx].interval);

			TIMER_INTERVALS[idx] = {
				...TIMER_INTERVALS[idx],
				end: dayjs(),
				interval: null
			};

			TIME_ENTRIES[idx] = {
				...TIME_ENTRIES[idx],
				end: dayjs(),
				secondsElapsed: TIMER_INTERVALS[idx].secondsElapsed
			}

			localTimers('save');
			localTimeEntries('save');
		}
	});

	// update title on form submit
	form.addEventListener("submit", function(e) {
		e.preventDefault();
		form.querySelector("input").blur();

		updateTitle(idx, e.target[0].value);
	});
	// or on leaving the input field
	form.querySelector("input").addEventListener("blur", function(e) {
		updateTitle(idx, e.target.value);
	});
});
/**
 * LAYOUT FUNCTIONS
 */
updateLayout();

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
/**
 * TABS
 */
const tabsNav = document.querySelector("#tabs");
const inactiveColor = tabsNav.dataset["inactiveColor"];

document.querySelectorAll(".tab").forEach(tab => {
	tab.addEventListener('click', function() {
		const target = tab.dataset["content"];
		const activeColor = tab.dataset["color"];

		tab.classList.add("active", activeColor);
		tab.classList.remove(inactiveColor);

		let siblings = getSiblings(tab);
		siblings.forEach(sib => {
			sib.classList.remove("active", activeColor);
			sib.classList.add(inactiveColor);
		});

		document.querySelectorAll(".tab-content").forEach(tabContent => {
			if(tabContent.getAttribute("id") !== target && !tabContent.classList.contains("hidden")) {
				tabContent.classList.add("hidden");
			}

			if(tabContent.getAttribute("id") === target && tabContent.classList.contains("hidden")) {
				tabContent.classList.remove("hidden");
			}
		});
	});
});
/**
 * TIME ENTRIES
 */
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

// TODO: display time entries in #time_entries