$(document).ready(function () {
	if(!toBoolean($session.isFirstEnter))
		$("#analyticsContainer").append('<div class="lds-ring"><div></div><div></div><div></div><div>');

	$.post("http://taxitime.pro/api/MainData.php", { 
		getAgregatorsData: JSON.stringify({
			"limit": "500",
			"offset": "0"
		})
	}).done(function (dataOfAgreagators) {

		$("#analyticsContainer").html("");
		$(".analyticsChoose").css("display", "block");
		$(".analyticsBtn").css("display", "block");

		let agregators = JSON.parse(dataOfAgreagators);
		for(let i = 0; i < agregators.length; i++)
			$("#analyticsContainer").append('<div class="analyticsBoxDiv"><a href="sign-in.html" class="transition"><div class="analyticsBox"><div class="borderOrange"><div class="borderOrange2"><img src="'+agregators[i].logo_url+'" alt="Агрегатор"></div></div><p class="analyticsBoxHour">Заработок в час</p><div class="analyticsBoxTable"><div class="analyticsBoxTableRow"><p class="value">до '+agregators[i].economy_price+' ₽</p><p>Эконом</p></div><div class="analyticsBoxTableRow"><p class="value">до '+agregators[i].comfort_price+' ₽</p><p>Комфорт</p></div></div><hr><p class="analyticsBoxText">'+agregators[i].name+'</p></div></a></div>');

		$(".transition").click(function (e) {
			e.preventDefault()
			linkLocation = this.href;
			$("body").fadeOut(PAGE_DELAY, function () {
				window.location = linkLocation;
			});
		});
	}).fail(function() {
		modalAlert("Server error!", 2, "Problem with server!");
	});

});