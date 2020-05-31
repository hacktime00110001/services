$(document).ready(function () {
	let userdata = JSON.parse($store.getItem("userdata"));

	$("#city").text(userdata.city);
	$("#name").text(userdata.name);
	$("#surname").text(userdata.surname);
	$("#patronymic").text(userdata.patronymic);
	$("#date").text(userdata.date_of_birthday);
	$("#exp").text(userdata.driving_experience);

	$("#support").click(function () {
		$store.setItem("currentPage", "support.html");
		$store.setItem("lastPage", "profile.html");
	});
});