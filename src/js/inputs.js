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