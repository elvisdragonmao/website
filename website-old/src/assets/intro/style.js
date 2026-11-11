function isElementInViewport(el) {
	const rect = el.getBoundingClientRect();
	return rect.bottom < 0 || rect.top > window.innerHeight;
}

function addClassToVisibleElements() {
	var aosElements = document.querySelectorAll(".aos, li");
	aosElements.forEach(function (aosElement) {
		if (!isElementInViewport(aosElement)) aosElement.classList.add("ed");
		else aosElement.classList.remove("ed");
	});
}

const showBody = () => {
	document.body.style.opacity = 1;
	// setTimeout(() => {
	addClassToVisibleElements();
	// }, 300);
};
addClassToVisibleElements();

document.addEventListener("scroll", addClassToVisibleElements);
window.addEventListener("pageshow", showBody);
