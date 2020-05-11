$(document).ready(function () {
	let $store = localStorage;

	$("#analyticsContainer").append('<div class="lds-ring"><div></div><div></div><div></div><div>');

	$.post("http://taxitime.pro/api/MainData.php", { 
		getAgregatorsData: JSON.stringify({
			"limit": "4",
			"offset": "0"
		})
	}).done(function (data) {
		$("#analyticsContainer").html("");

		let userdata = JSON.parse(data),
			$content = $("#analyticsContainer");

		for(i = 0; i < userdata.length; i++)
			$content.append('<div class="analyticsBoxDiv"><a href="./info-about-agregator.html" class="transition" data-id=\''+userdata[i].id+'\'><div class="analyticsBox"><div class="borderOrange"><div class="borderOrange2"><img src="'+userdata[i].logo_url+'" alt="Агрегатор"></div></div><p class="analyticsBoxHour">Заработок в час</p><div class="analyticsBoxTable"><div class="analyticsBoxTableRow"><p class="value">до '+userdata[i].economy_price+' ₽</p><p>Эконом</p></div><div class="analyticsBoxTableRow"><p class="value">до '+userdata[i].comfort_price+' ₽</p><p>Комфорт</p></div></div><hr><p class="analyticsBoxText">'+userdata[i].name+'</p></div></a></div>');
		
		$("a").click(function () {
			attrValue = $(this).attr('data-id');
			if(attrValue != undefined) {
				$store.setItem("lastVisitAgregator", attrValue);
			}
		});

		$(".transition").click(function (e) {
			e.preventDefault();
			linkLocation = this.href;
			$("body").fadeOut(PAGE_DELAY, function () {
				window.location = linkLocation;
			});
		});

	}).fail(function(xhr, textStatus, error) {
		modalAlert("Server error!", 2, "Problem with server!");
	});
});