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
		Object.keys(storedTimeEntries).forEach(key => {
			const storedEntry = storedTimeEntries[key];
			const t = getTimeObject(storedEntry.secondsElapsed);

			const entry = {
				id: key,
				title: storedEntry.title,
				time: `${padTime(t.h)}:${padTime(t.m)}:${padTime(t.s)}`,
				created: dayjs(storedEntry.created).format("YYYY-MM-DD HH:mm:ss"),
				updated: dayjs(storedEntry.updated).format("YYYY-MM-DD HH:mm:ss")
			}

			let row = document.createElement("tr");

			Object.keys(entry).forEach(k => {
				let td = document.createElement("td");
				td.innerText = entry[k];
				row.append(td);
			})

			// clear table and re-add rows to avoid duplicates
			timeEntries.innerHTML = "";
			timeEntries.append(row);
		});
	}
}
updateTimeEntries();

document.querySelectorAll(".tab").forEach(tab => {
	if(tab.dataset["content"] === "time_entries") {
		tab.addEventListener("click", updateTimeEntries);
	}
})