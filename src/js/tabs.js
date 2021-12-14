/**
 * TABS
 */
const tabsNav = document.querySelector("#tabs");
const inactiveColor = tabsNav.dataset["inactiveColor"];

document.querySelectorAll(".tab").forEach(tab => {
	tab.addEventListener('click', function() {
		const target = tab.dataset["content"];
		const activeColor = tab.dataset["color"];

		tab.classList.add("active", activeColor);
		tab.classList.remove(inactiveColor);

		let siblings = getSiblings(tab);
		siblings.forEach(sib => {
			sib.classList.remove("active", activeColor);
			sib.classList.add(inactiveColor);
		});

		document.querySelectorAll(".tab-content").forEach(tabContent => {
			if(tabContent.getAttribute("id") !== target && !tabContent.classList.contains("hidden")) {
				tabContent.classList.add("hidden");
			}

			if(tabContent.getAttribute("id") === target && tabContent.classList.contains("hidden")) {
				tabContent.classList.remove("hidden");
			}
		});
	});
});