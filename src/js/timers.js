/**
 * TIMERS
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

function showTimerTime(target, idx) {
	let time = dayjs(TIMER_INTERVALS[idx].start);
	let res = {
		h: time.format('HH'),
		m: time.format('mm'),
		s: time.format('ss'),
	};

	TIMER_INTERVALS[idx] = {
		...TIMER_INTERVALS[idx],
		...res
	}

	localTimers('save');

	target.innerText = `${res.hour}:${res.minute}:${res.second}`;
}

/**
 * CLICK HANDLERS
 */
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
		h: dayjs().format('HH'),
		m: dayjs().format('mm'),
		s: dayjs().format('ss'),
		interval: null,
		start: dayjs().format('HH:mm:ss')
	};

	TIME_ENTRIES[idx] = {
		title,
		h: dayjs().format('HH'),
		m: dayjs().format('mm'),
		s: dayjs().format('ss'),
		date: dayjs().format('YYYY-MM-DD'),
		start: dayjs().format('HH:mm:ss'),
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

	const startTime = dayjs(TIMER_INTERVALS[idx].start);
	const currentTime = dayjs();
	const d = startTime.diff(currentTime);
	timeContainer.innerText = "TESTING";

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
				h: dayjs().format('HH'),
				m: dayjs().format('mm'),
				s: dayjs().format('ss'),
				interval: null,
				end: dayjs().format('HH:mm:ss')
			};
			timeContainer.innerText = "00:00:00";

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
			timeContainer.innerText = "00:00:00";

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