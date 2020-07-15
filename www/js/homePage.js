$(document).ready(function () {
	let $store = localStorage;

	$("#analyticsContainer").append('<div class="lds-ring"><div></div><div></div><div></div><div>');

	let $cityList = $("#selectCat");

	let user_store_data = JSON.parse($store.getItem("userdata"));
	let current_city = user_store_data.city;

	$("#selectCat").bind("change", function () {
		current_city = $("#getCity").text();
		$.ajax({
			url: API_CONTROLLERS.MAIN_DATA,
			type: 'POST',
			dataType: 'json',
			data: { getAgregatorsData : { "city": current_city, "limit": APP.LOAD_LIMIT.AGREGATORS.HOMEPAGE, "offset": APP.OFFSET.AGREGATORS, "page": "home" } },
			success: homepageLoadSuccess,
			error: homepageLoadFail
		});
	});

	$.ajax({
		url: API_CONTROLLERS.PROFILE,
		type: 'POST',
		dataType: 'json',
		data: { getCities : { getCities : true } },
		success: getListOfSitiesSuccess,
		error: getListOfSitiesFail
	});

	function getListOfSitiesSuccess(data, status, xhr) {
		var cities = data.cities;
		cities.forEach((item, key) => {
			if(item == current_city) {
				$("#getCity").html(item);
				$cityList.append(`<option selected>${item}</option>`);
			} else {
				$cityList.append(`<option>${item}</option>`);
			}
		});
	}

	function getListOfSitiesFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!");
	}

	$.ajax({
		url: API_CONTROLLERS.MAIN_DATA,
		type: 'POST',
		dataType: 'json',
		data: { getAgregatorsData : { "city": current_city, "limit": APP.LOAD_LIMIT.AGREGATORS.HOMEPAGE, "offset": APP.OFFSET.AGREGATORS, "page": "home" } },
		success: homepageLoadSuccess,
		error: homepageLoadFail
	});

	function homepageLoadSuccess(userdata, status, xhr) {
		console.log(userdata);
		$("#analyticsContainer").html("");

		let $content = $("#analyticsContainer");

		$content.html("");

		if(userdata.length == 0) {
			$content.html(`<div style="width: 85%; max-width: 275px; margin:auto; text-align: center;">По данному городу ничего не найдено!</div>`);
		}

		for(i = 0; i < userdata.length; i++)
			$content.append(`
				<div class="analyticsBoxDiv">
					<a href="./info-about-agregator.html" class="transition" data-id="${userdata[i].id}">
						<div class="analyticsBox">
							<div class="borderOrange">
								<div class="borderOrange2">
									<img src="${userdata[i].logo_url}" alt="Агрегатор">
								</div>
							</div>
							<!-- <p class="analyticsBoxHour">Заработок в час</p> -->
							<div class="analyticsBoxTable" style="height:30px;">
								<!--<div class="analyticsBoxTableRow">
									<p class="value">до ${userdata[i].economy_price} ₽</p>
									<p>Эконом</p>
								</div>
								<div class="analyticsBoxTableRow">
									<p class="value">до ${userdata[i].comfort_price} ₽</p>
									<p>Комфорт</p>
								</div>-->
							</div>
							<hr>
							<p class="analyticsBoxText">${userdata[i].name}</p>
						</div>
					</a>
				</div>
			`);
		
		$("a").click(function () {
			attrValue = $(this).attr('data-id');
			if(attrValue != undefined) { $store.setItem("lastVisitAgregator", attrValue); }
		});

		$(".transition").click(function (e) {
			e.preventDefault();
			linkLocation = this.href;
			$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = linkLocation; });
		});
	}

	function homepageLoadFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!");
	}
	
});