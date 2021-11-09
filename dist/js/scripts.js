//main.js file
let OPTIONS = Array.from(document.querySelectorAll(".opt-input")).map((el) => ({ name: el.name, value: el.type === "checkbox" ? el.checked : el.value }));

const COUNTER = document.querySelector("#counter");
const LINE = document.querySelector("#line");

let storedTimers = localStorage.getItem('timers') ? JSON.parse(localStorage.getItem('timers')) : null;

if(OPTIONS.show_seconds) {
	document.querySelector("#seconds_display").classList.remove("hidden");
}

if(OPTIONS.show_seconds && OPTIONS.seconds_display === 'line') {
	LINE.classList.remove("hidden");
	COUNTER.classList.add("bg-neutral-400");

} else {
	LINE.classList.add("hidden");
	COUNTER.classList.remove("bg-neutral-400");
}

const CLOCK = document.querySelector("#clock");

var CLOCK_INTERVAL = setInterval(showClockTime, 1000);
var TIMER_INTERVALS = {};

function showClockTime() {
	let time = new Date();

	let hour = time.getHours();
	let min = time.getMinutes();
	let sec = time.getSeconds();
	let iSec = time.getSeconds();

	let opts = {
		hr24: OPTIONS.hr_24,
		show_seconds: OPTIONS.show_seconds,
		seconds_display: OPTIONS.sec_options
	}

	let am_pm = hour > 12 ? "PM" : "AM";
	if(hour > 12 && !opts.hr_24) hour -= 12;

	hour = hour < 10 ? "0" + hour : hour;
	min = min < 10 ? "0" + min : min;
	sec = sec < 10 ? "0" + sec : sec;

	let currentTime = `${hour}:${min}`;
	if(opts.show_seconds && opts.seconds_display === 'numbers') {
		currentTime += `:${sec}`;
	}
	if(!opts.hr24) currentTime += ` ${am_pm}`;

	if(opts.show_seconds && opts.seconds_display === 'dots') {
		let dot = '<i class="fas fa-circle fa-xs mx-0.5"></i>';
		COUNTER.innerHTML = Array(iSec).fill(dot).join("");
	}

	if(opts.show_seconds && opts.seconds_display === 'line') {
		let width = (iSec / 60) * 100;

		LINE.style.width = `${width}%`;
	}

	CLOCK.innerText = currentTime;
}

function showTimerTime(target, idx, h=0,m=0,s=0) {
	if(h > TIMER_INTERVALS[idx].h) h++;

	if(s < 59) {
		s++;
	} else if(s >= 59 && m < 59) {
		s = 0;
		m++;
	} else if(s >= 59 && m >= 59) {
		s = 0;
		m = 0;
		h++
	}

	let hour = h >= 10 ? h : `0${h}`;
	let minute = m >= 10 ? m : `0${m}`;
	let second = s >= 10 ? s : `0${s}`;

	TIMER_INTERVALS[idx].h = h;
	TIMER_INTERVALS[idx].m = m;
	TIMER_INTERVALS[idx].s = s;

	localStorage.setItem('timers', JSON.stringify(TIMER_INTERVALS));

	target.innerText = `${hour}:${minute}:${second}`;
}

document.querySelectorAll(".opt-input").forEach(item => {
		item.addEventListener('click', function() {
			clearInterval(CLOCK_INTERVAL);
			CLOCK_INTERVAL = setInterval(showClockTime, 1000);
		});
});

document.querySelectorAll(".timer form").forEach(timerForm => {
	const timerParent = timerForm.parentNode.parentNode;
	console.log(timerParent);
	timerForm.addEventListener("submit", function(e) {
		e.preventDefault();
		
	});
});

document.querySelectorAll(".play-pause").forEach((item, index) => {
	const button = item.childNodes[0];
	const parent = item.parentNode;

	let time;
	let idx = index;
	let title = '';

	if(parent.classList.contains("timer") && parent.childNodes.length > 0) {
		for(var i = 0; i < parent.childNodes.length; i++) {
			var node = parent.childNodes[i];

			if(node.classList !== undefined && node.classList.contains("title-input")) {
				title = node.childNodes[0].value;
			}
		}
	}

	TIMER_INTERVALS[idx] = {
		title,
		h: 0,
		m: 0,
		s: 0,
		interval: null
	};

	item.addEventListener("click", function() {
		storedTimers = localStorage.getItem('timers') ? JSON.parse(localStorage.getItem('timers')) : null;

		const playing = item.dataset.playing;

		if(parent.classList.contains("timer") && parent.childNodes.length > 0) {
			for(var i = 0; i < parent.childNodes.length; i++) {
				var node = parent.childNodes[i];

				if(node.classList !== undefined && node.classList.contains("title-input")) {
					title = node.childNodes[0].value;
				}

				if(node.classList !== undefined && node.classList.contains("time")) {
					time = node;
					break;
				}
			}
		}

		if(playing === "true" && time !== undefined) {
			item.dataset.playing = "false";
			button.classList.add("fa-play-circle");
			button.classList.remove("fa-pause-circle");

			clearInterval(TIMER_INTERVALS[idx].interval)

		} else {
			item.dataset.playing = "true";
			button.classList.remove("fa-play-circle");
			button.classList.add("fa-pause-circle");

			if(storedTimers !== null && storedTimers[idx].title === title) {
				TIMER_INTERVALS[idx] = {
					...storedTimers[idx],
					interval: null
				}
			}

			TIMER_INTERVALS[idx].interval = setInterval(function() {
					showTimerTime(time, idx, TIMER_INTERVALS[idx].h, TIMER_INTERVALS[idx].m, TIMER_INTERVALS[idx].s);
				}, 1000)
		}
	});
});

