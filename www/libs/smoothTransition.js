$(document).ready(function () {
	$("body").fadeIn(1000);
	$(".transition").click(function (e) {
		e.preventDefault();
		linkLocation = this.href;
		$("body").fadeOut(1000, function () {
			window.location = linkLocation;
		});
	});
});