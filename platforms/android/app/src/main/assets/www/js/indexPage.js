$(document).ready(function () {
	$(".content_index_button").bind("click", function (e) {
		let user_type = $(this).attr('data-value');
		localStorage.setItem("user_type", user_type);
		smooth_transition("./sign-in.html");
	});
});