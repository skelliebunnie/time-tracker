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