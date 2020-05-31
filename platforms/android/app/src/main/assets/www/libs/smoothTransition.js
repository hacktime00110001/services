$(document).ready(function () {
	$("body").fadeIn(APP.PAGE_DELAY);
	$(".transition").click(function (e) {
		e.preventDefault();
		linkLocation = this.href;
		$("body").fadeOut(APP.PAGE_DELAY, function () {
			window.location = linkLocation;
		});
	});
});