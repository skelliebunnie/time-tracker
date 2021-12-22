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
		Object.keys(TIME_ENTRIES.docs).forEach(key => {
			if(!TIME_ENTRIES.docs[key].title) delete TIME_ENTRIES.docs[key];
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

	if(storedTimeEntries.count > 0) {
		timeEntries.innerHTML = "";
		
		Object.keys(storedTimeEntries.docs).forEach(key => {
			const storedEntry = storedTimeEntries.docs[key];
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
				TIME_ENTRIES.count = TIME_ENTRIES.count > 0 ? TIME_ENTRIES.count - 1 : 0;
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