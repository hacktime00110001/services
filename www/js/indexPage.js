$(document).ready(function () {
	if(!toBoolean($session.isFirstEnter))
		$("#analyticsContainer").append('<div class="lds-ring"><div></div><div></div><div></div><div>');

	$.ajax({
		url: API_CONTROLLERS.MAIN_DATA,
		type: 'POST',
		dataType: 'json',
		data: { getAgregatorsData : { "limit": APP.LOAD_LIMIT.AGREGATORS.INDEX, "offset": APP.OFFSET.AGREGATORS } },
		success: indexLoadSuccess,
		error: indexLoadFail
	});

	function indexLoadSuccess(data, status, xhr) {
		$("#analyticsContainer").html("");
		$(".analyticsChoose").css("display", "block");
		$(".analyticsBtn").css("display", "block");

		let agregators = data;
		for(let i = 0; i < agregators.length; i++)
			$("#analyticsContainer").append('<div class="analyticsBoxDiv"><a href="sign-in.html" class="transition"><div class="analyticsBox"><div class="borderOrange"><div class="borderOrange2"><img src="'+agregators[i].logo_url+'" alt="Агрегатор"></div></div><p class="analyticsBoxHour">Заработок в час</p><div class="analyticsBoxTable"><div class="analyticsBoxTableRow"><p class="value">до '+agregators[i].economy_price+' ₽</p><p>Эконом</p></div><div class="analyticsBoxTableRow"><p class="value">до '+agregators[i].comfort_price+' ₽</p><p>Комфорт</p></div></div><hr><p class="analyticsBoxText">'+agregators[i].name+'</p></div></a></div>');

		$(".transition").click(function (e) {
			e.preventDefault()
			linkLocation = this.href;
			$("body").fadeOut(APP.PAGE_DELAY, function () {
				window.location = linkLocation;
			});
		});
	}

	function indexLoadFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, `Problem with server!`);
	}

});