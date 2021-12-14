/**
 * TIME ENTRIES
 */
function localTimeEntries(action) {
	let res;

	if(action === "get") {
		res = localStorage.getItem('time_entries') !== undefined ? JSON.parse(localStorage.getItem('time_entries')) : { message: 'no time_entries found' };
	}

	if(action === "set" || action === "save") {
		localStorage.setItem('time_entries', JSON.stringify(TIME_ENTRIES));
		res = { message: 'saved time entries' };
	}

	if(action === "clear") {
		localStorage.removeItem('time_entries');
		res = { message: 'timers removed' };
	}

	return res;
}

// TODO: display time entries in #time_entries