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
