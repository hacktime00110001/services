$(document).ready(function () {
	$("body").fadeIn(PAGE_DELAY);
	$(".transition").click(function (e) {
		e.preventDefault();
		linkLocation = this.href;
		$("body").fadeOut(PAGE_DELAY, function () {
			window.location = linkLocation;
		});
	});
});