const clockContainer = document.querySelector("#clock_container");
const tabbedContentContainer = document.querySelector("#tabbedContent");
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
let TIMERS = {};
let storedTimers = localStorage.getItem('sktt_timers') ? JSON.parse(localStorage.getItem('sktt_timers')) : null;

/** TIME ENTRIES **/
let TIME_ENTRIES = {};
let storedTimeEntries = localStorage.getItem('sktt_time_entries') ? JSON.parse(localStorage.getItem('sktt_time_entries')) : null;
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

function getTimeObject(seconds) {
	return {
		h: Math.floor(seconds / 3600),
		m: Math.floor(seconds / 60 % 60),
		s: Math.floor(seconds % 60)
	};
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

// check for stored timers, and if none found add a starting one
// otherwise, load up the saved timers
if(storedTimers === null) {
	let idx = uuidv4();
	buildTimer(idx);

} else {
	Object.keys(storedTimers).forEach(key => {
		buildTimer(key);
	});
}

function localTimers(action) {
	let res;

	if(action === "get") {
		res = localStorage.getItem('sktt_timers') !== undefined ? JSON.parse(localStorage.getItem('sktt_timers')) : { message: 'no timers found' };
	}

	if(action === "set" || action === "save") {
		localStorage.setItem('sktt_timers', JSON.stringify(TIMERS));
		res = { message: 'saved timers' };
	}

	if(action === "clear") {
		localStorage.removeItem('sktt_timers');
		res = { message: 'timers removed' };
	}

	return res;
}

function showTimerTime(target, idx, update=false) {
	if(update) {
		let startTime = dayjs(TIMERS[idx].start);
		let currentTime = dayjs();
		let diff = currentTime.diff(startTime, 'second', true);

		let res = getTimeObject(diff);

		TIMERS[idx] = {
			...TIMERS[idx],
			secondsElapsed: Math.floor(diff)
		}

		localTimers('save');

		target.innerText = `${padTime(res.h)}:${padTime(res.m)}:${padTime(res.s)}`;

	} else if(TIMERS[idx].secondsElapsed > 0) {
		const s = TIMERS[idx].secondsElapsed;
		let res = getTimeObject(s);

		target.innerText = `${padTime(res.h)}:${padTime(res.m)}:${padTime(res.s)}`;

	} else {
		target.innerText = `00:00:00`;

	}
}

function padTime(i) {
	if(i < 10) i = `0${i}`;
	return i;
}

function updateData(idx) {
	let timer, timeContainer, title;
	storedTimers = localTimers("get");

	// if data for the idx exists in localStorage, use that
	if(storedTimers !== null && !storedTimers.message && storedTimers[idx]) {

		TIMERS[idx] = {
			...storedTimers[idx],
			interval: null
		};

		if(storedTimeEntries !== null && storedTimeEntries[idx]) {
			TIME_ENTRIES[idx] = { ...storedTimeEntries[idx] };
		}

	} else {
		// otherwise, set up new data
		TIMERS[idx] = {
			title: `timer-${idx.substring(0,5)}`,
			interval: null,
			start: dayjs(),
			secondsElapsed: 0
		};

		TIME_ENTRIES[idx] = {
			title: `timer-${idx.substring(0,5)}`,
			created: dayjs(),
			updated: dayjs(),
			secondsElapsed: 0
		};

		// localTimers("save");
	}

	document.querySelectorAll(".timer").forEach(t => {
		if(t.dataset["idx"] === idx) {
			timer = t;
			timeContainer = t.querySelector(".time");
		}
	});

	// if we can find the timer on the page, show the time elapsed
	if(timer !== undefined) {
		showTimerTime(timeContainer, idx);

	}
}

function buildTimer(idx) {
	if(idx !== undefined) {
		let template = document.querySelector("#timerTemplate");
		let timer = template.content.cloneNode(true);
		timer.querySelector(".timer").dataset["idx"] = idx;

		let formContent = timer.querySelector(".form").innerHTML;
		timer.querySelector(".form").innerHTML = formContent.replace("${title}", `timer-${idx.substring(0,5)}`);

		const playPauseBtn = timer.querySelector(".play-pause > i");
		const removeTimerBtn = timer.querySelector(".remove-timer > i");

		let clearTimeBtn = timer.querySelector(".clear-time");
		let saveTimeBtn = timer.querySelector(".save-time");

		let timeContainer = timer.querySelector(".time");

		// handle starting/stopping timer
		playPauseBtn.addEventListener("click", function() {
			const playing = playPauseBtn.dataset.playing;

			// if playing is true, then we need to PAUSE
			if(playing === "true") {
				playPauseBtn.dataset.playing = "false";
				playPauseBtn.classList.add("fa-play-circle");
				playPauseBtn.classList.remove("fa-pause-circle");

				clearInterval(TIMERS[idx].interval);

			} else {
				playPauseBtn.dataset.playing = "true";
				playPauseBtn.classList.remove("fa-play-circle");
				playPauseBtn.classList.add("fa-pause-circle");

				// reset "start" time for accurate counting after pause
				// subtracting secondsElapsed to continue count-up correctly
				TIMERS[idx].start = TIMERS[idx].secondsElapsed > 0 ? dayjs().subtract(TIMERS[idx].secondsElapsed, 'seconds') : dayjs();

				TIMERS[idx].interval = setInterval(function() {
						showTimerTime(timeContainer, idx, true);
					}, 500);

				clearTimeBtn.classList.remove("disabled");
				saveTimeBtn.classList.remove("disabled");
			}
		});

		removeTimerBtn.addEventListener("click", function() {
			let timer;
			document.querySelectorAll(".timer").forEach(t => {
				if(t.dataset["idx"] === idx) {
					timer = t;
				}
			});
			console.log(timer)

			if(timer) {
				timer.remove();
			}

			delete(TIMERS[idx]);
			localTimers("save");
		});

		timersContainer.append(timer);
		updateData(idx);
	}
}

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
	let storedOptions = localStorage.getItem('sktt_timer_options') !== undefined ? JSON.parse(localStorage.getItem('sktt_timer_options')) : null;
	
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

	localStorage.setItem('sktt_timer_options', JSON.stringify(OPTIONS));

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
function updateTitle(idx, title) {
	TIMERS[idx].title = title;
	localTimers('save');

	if(TIME_ENTRIES[idx]) {
		TIME_ENTRIES[idx].title = title;
	}

	storedTimeEntries = localTimeEntries("get");
	if(storedTimeEntries[idx]) {
		localTimeEntries("save");
	}
}

document.querySelectorAll(".timer").forEach(timer => {
	const form = timer.querySelector("form");
	const idx = timer.dataset['idx'];
	const playPauseBtn = timer.querySelector(".play-pause > i");

	storedTimers = localTimers('get');

	let clearTimeBtn = timer.querySelector(".clear-time");
	let saveTimeBtn = timer.querySelector(".save-time");
	let title = timer.querySelector("[name='title']").value;

	let timeContainer = timer.querySelector(".time");

	// if there's a stored timer with the same ID, "merge" the data
	if(storedTimers !== null && !storedTimers.message && storedTimers[idx]) {
		TIMERS[idx] = {
			...storedTimers[idx],
			interval: null
		};

		title = TIMERS[idx].title !== storedTimers[idx].title ? storedTimers[idx].title : TIMERS[idx].title;
	}

	// update title in input field
	if(timer.querySelector("[name='title']").value !== title) {
		timer.querySelector("[name='title']").value = title;
	}
	// disable save/clear buttons if at least one time is greater than 0
	if(TIMERS[idx] && TIMERS[idx].secondsElapsed > 0) {
		clearTimeBtn.classList.remove("disabled");
		saveTimeBtn.classList.remove("disabled");
	}

	// handle clearing timer "count-up"
	clearTimeBtn.addEventListener("click", function() {
		if(!clearTimeBtn.classList.contains("disabled")) {
			playPauseBtn.dataset.playing = false;
			playPauseBtn.classList.remove("fa-pause-circle");
			playPauseBtn.classList.add("fa-play-circle");

			clearInterval(TIMERS[idx].interval);

			TIMERS[idx] = {
				...TIMERS[idx],
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

			title = timer.querySelector("[name='title']").value;
			storedTimers = localTimers("get");
			storedTimeEntries = localTimeEntries("get");

			playPauseBtn.dataset.playing = false;
			playPauseBtn.classList.remove("fa-pause-circle");
			playPauseBtn.classList.add("fa-play-circle");

			clearInterval(TIMERS[idx].interval);

			TIMERS[idx] = {
				...TIMERS[idx],
				lastSaved: dayjs(),
				interval: null
			};
			localTimers('save');

			if(storedTimeEntries[idx]) {
				TIME_ENTRIES[idx] = {
					...storedTimeEntries[idx],
					updated: dayjs(),
					secondsElapsed: TIMERS[idx].secondsElapsed
				}

				if(storedTimeEntries[idx].title !== title) {
					TIME_ENTRIES[idx].title = title;
				}
			} else {
				TIME_ENTRIES[idx] = {
					title:  title,
					created: dayjs(),
					updated: dayjs(),
					secondsElapsed: TIMERS[idx].secondsElapsed
				}
			}

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

const addTimerBtn = document.querySelector(".add-timer");
addTimerBtn.addEventListener("click", function() {
	let newTimerIndex = uuidv4();
	buildTimer(newTimerIndex);
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

		tabbedContentContainer.classList.remove("place-bottom", "md:place-right");
		tabbedContentContainer.classList.add("place-top", "md:place-left");

	} else {
		clockContainer.classList.remove("place-bottom", "md:place-right");
		clockContainer.classList.add("place-top", "md:place-left");

		tabbedContentContainer.classList.remove("place-top", "md:place-left");
		tabbedContentContainer.classList.add("place-bottom", "md:place-right");
	}
}
/**
 * TABS
 */
const tabsNav = document.querySelector("#tabs");
const inactiveColor = tabsNav.dataset["inactiveColor"];

let tabTarget = "timers_container";
if(localStorage.getItem('sktt_tab')) {
	tabTarget = localStorage.getItem('sktt_tab');
}

handleTabs(tabTarget);

function handleTabs(t) {
	let tab = document.querySelectorAll(".tab")[0];
	document.querySelectorAll(".tab").forEach(thisTab => {
		if(thisTab.dataset["content"] === t) {
			tab = thisTab;
			return;
		}
	});
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

	localStorage.setItem("sktt_tab", target);
}

document.querySelectorAll(".tab").forEach(tab => {
	tab.addEventListener('click', function() {
		handleTabs(tab.dataset["content"]);
	});
});
/**
 * TIME ENTRIES
 */
let timeEntries = document.querySelector("#time_entries tbody");

function localTimeEntries(action) {
	let res;

	if(action === "get") {
		res = localStorage.getItem('sktt_time_entries') !== undefined ? JSON.parse(localStorage.getItem('sktt_time_entries')) : { message: 'no time_entries found' };
	}

	if(action === "set" || action === "save") {
		Object.keys(TIME_ENTRIES).forEach(key => {
			if(!TIME_ENTRIES[key].title) delete TIME_ENTRIES[key];
		});

		localStorage.setItem('sktt_time_entries', JSON.stringify(TIME_ENTRIES));
		res = { message: 'saved time entries' };
	}

	if(action === "clear") {
		localStorage.removeItem('sktt_time_entries');
		res = { message: 'timers removed' };
	}

	return res;
}

function updateTimeEntries() {
	storedTimeEntries = localTimeEntries("get");

	if(storedTimeEntries !== null && Object.keys(storedTimeEntries).length > 0) {
		timeEntries.innerHTML = "";
		
		Object.keys(storedTimeEntries).forEach(key => {
			const storedEntry = storedTimeEntries[key];
			const t = getTimeObject(storedEntry.secondsElapsed);

			let row = document.createElement("tr");
			row.setAttribute("id", `te-${key}`);

			const entry = {
				title: storedEntry.title,
				time: `${padTime(t.h)}:${padTime(t.m)}:${padTime(t.s)}`,
				created: dayjs(storedEntry.created).format("YYYY-MM-DD HH:mm:ss"),
				updated: dayjs(storedEntry.updated).format("YYYY-MM-DD HH:mm:ss")
			}

			Object.keys(entry).forEach(k => {
				let td = document.createElement("td");
				td.innerText = entry[k];
				row.append(td);
			});

			let removeTd = document.createElement("td");
			let removeBtn = document.createElement("i");
			removeBtn.classList.add("remove-time-entry", "fad", "fa-minus-square", "text-4xl", "text-accent-500", "hover:text-accent-700");

			removeBtn.addEventListener("click", function() {
				let r = document.querySelector(`#te-${key}`);
				r.remove();

				delete TIME_ENTRIES[key];
				localTimeEntries("save");
			});

			removeTd.append(removeBtn);
			row.append(removeTd);

			// clear table and re-add rows to avoid duplicates
			timeEntries.append(row);
		});
	}
}
updateTimeEntries();

document.querySelectorAll(".tab").forEach(tab => {
	if(tab.dataset["content"] === "time_entries") {
		tab.addEventListener("click", updateTimeEntries);
	}
});

document.querySelectorAll(".timer").forEach(timer => {
	timer.querySelector(".form").addEventListener("submit", updateTimeEntries);

	timer.querySelector(".title-input").addEventListener("blur", updateTimeEntries);
});