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

	} else if(TIMER_INTERVALS[idx].secondsElapsed > 0) {
		const s = TIMER_INTERVALS[idx].secondsElapsed;
		let res = {
			h: Math.floor(s / 3600),
			m: Math.floor(s / 60 % 60),
			s: Math.floor(s % 60)
		};

		target.innerText = `${padTime(res.h)}:${padTime(res.m)}:${padTime(res.s)}`;

	} else {
		target.innerText = `00:00:00`;

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
	// also check for secondsElapsed, in case old timers are stored
	if(storedTimers !== null && !storedTimers.message && storedTimers[idx] && storedTimers[idx].secondsElapsed) {
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