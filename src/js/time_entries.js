document.querySelectorAll(".tab").forEach(tab => {
	tab.addEventListener('click', function() {
		const target = tab.dataset["content"];

		tab.classList.add("active");
		let siblings = getSiblings(tab);
		siblings.forEach(sib => { sib.classList.remove("active"); })

		document.querySelectorAll(".tab-content").forEach(tabContent => {
			if(tabContent.getAttribute("id") !== target && !tabContent.classList.contains("hidden")) {
				tabContent.classList.add("hidden");
				tab.classList.removeClass(tabContent.dataset["color"]);
			}

			if(tabContent.getAttribute("id") === target && tabContent.classList.contains("hidden")) {
				tabContent.classList.remove("hidden");
				tab.classList.add(tabContent.dataset["color"]);
			}
		});
	});
});