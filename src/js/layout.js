/**
 * LAYOUT FUNCTIONS
 */
updateLayout();

function updateLayout() {
	// clock_right == place-bottom on mobile (< 640)
	if(OPTIONS.clock_right) {
		clockContainer.classList.remove("place-top", "md:place-left");
		clockContainer.classList.add("place-bottom", "md:place-right");

		timersContainer.classList.remove("place-bottom", "md:place-right");
		timersContainer.classList.add("place-top", "md:place-left");

	} else {
		clockContainer.classList.remove("place-bottom", "md:place-right");
		clockContainer.classList.add("place-top", "md:place-left");

		timersContainer.classList.remove("place-top", "md:place-left");
		timersContainer.classList.add("place-bottom", "md:place-right");
	}
}