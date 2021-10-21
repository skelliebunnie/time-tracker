//main.js file
let OPTIONS = Array.from(document.querySelectorAll(".opt-input")).map((el) => ({ name: el.name, value: el.type === "checkbox" ? el.checked : el.value }));

const COUNTER = document.querySelector("#counter");
const LINE = document.querySelector("#line");

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

var CLOCK_INTERVAL = setInterval(showTime, 1000);

function showTime() {
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

document.querySelectorAll(".opt-input").forEach(item => {
		item.addEventListener('click', function() {
			clearInterval(CLOCK_INTERVAL);
			CLOCK_INTERVAL = setInterval(showTime, 1000);
		});
});

const play = document.querySelector(".play");