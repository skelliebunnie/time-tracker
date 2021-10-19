//main.js file

const COUNTER = document.querySelector("#counter");
const LINE = document.querySelector("#line");
if(document.querySelector("#seconds_line").checked) {
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
		show_seconds: document.querySelector("#show_sec").checked,
		hr24: document.querySelector("#hr_24").checked,
		dot_seconds: document.querySelector("#seconds_dots").checked,
		line_seconds: document.querySelector("#seconds_line").checked
	}

	let am_pm = hour > 12 ? "PM" : "AM";
	if(hour > 12 && !opts.hr24) hour -= 12;

	hour = hour < 10 ? "0" + hour : hour;
	min = min < 10 ? "0" + min : min;
	sec = sec < 10 ? "0" + sec : sec;

	let currentTime = `${hour}:${min}`;
	if(opts.show_seconds) currentTime += `:${sec}`;
	if(!opts.hr24) currentTime += ` ${am_pm}`;

	if(opts.dot_seconds) {
		let dot = '<i class="fas fa-circle fa-xs mx-0.5"></i>';
		COUNTER.innerHTML = Array(iSec).fill(dot).join("");
	}

	if(opts.line_seconds) {
		let width = (iSec / 60) * 100;

		LINE.style.width = `${width}%`;
	}

	CLOCK.innerText = currentTime;
}

document.querySelectorAll(".opt-input").forEach(item => {
		item.addEventListener('click', function() {
			if(document.querySelector("#show_line_secs").checked) {
				COUNTER.appendChild(LINE);
			} else {
				COUNTER.innerHTML = "";
			}

			clearInterval(CLOCK_INTERVAL);
			CLOCK_INTERVAL = setInterval(showTime, 1000);
		});
});