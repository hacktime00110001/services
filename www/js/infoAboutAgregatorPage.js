$(document).ready(function () {

	let $store = localStorage,
		$defaultPartnerLoadLimit = APP.LOAD_LIMIT.PARTNERS.DEFAULT,
		$searchPartnerLoadLimit = APP.LOAD_LIMIT.PARTNERS.SEARCH,
		$filtredPartnerLoadLimit = APP.LOAD_LIMIT.PARTNERS.FILTERED,
		$defaultLoadBy = APP.LOAD_BY.PARTNERS.DEFAULT,
		$searchLoadBy = APP.LOAD_BY.PARTNERS.SEARCH,
		$filterLoadBy = APP.LOAD_LIMIT.PARTNERS.FILTERED,
		$startOffset = APP.OFFSET.PARTNERS;

	$store.agregatorMode = 0;

	$("#agregatorSearchBtn").on("click", function() { $("#agregatorSearchContainer").fadeToggle("slow", "linear"); }); 

	$("#clean_filter").click(function () {
		$("input[type='radio']").prop("checked", false);
		$("#default_radio1").prop("checked", true);
		$("#default_radio2").prop("checked", true);
		$("input[type='checkbox']").parent().removeClass("checkboxWhiteOff");
		$("input[type='checkbox']").parent().addClass("checkboxWhiteOn");
		$("input[type='checkbox']").prop("checked", true);
	});

	function retingUpdate() {
		let $high = "agrBox_rateGreen",
			$medium = "agrBox_rateYellow",
			$low = "agrBox_rateRed";

		let $retingsBlock = document.querySelectorAll(".reting"),
			$parents = document.querySelectorAll(".agregatorBox_rating");
		
		for(q = 0; q < $retingsBlock.length; q++) {
			$reting = parseFloat($retingsBlock[q].innerHTML);
			if($reting >= 4.5 && $reting <= 5.0)
				$parents[q].classList.add($high);
			else if($reting >= 4.0 && $reting < 4.5)
				$parents[q].classList.add($medium);
			else 
				$parents[q].classList.add($low);
		}
	}

	// Content load event //
	let f = true;
		$(window).scroll(function() {
			if(f) {
				target = $('.targetElemScroll');
				if(target.offset() != undefined) {
					targetPos = target.offset().top;
				} else {
					f = false;
				}
				winHeight = $(window).height();
				scrollToElem = targetPos - winHeight;
				winScrollTop = $(this).scrollTop();
				if(winScrollTop > scrollToElem && f) {
					f = false;
					$('.targetElemScroll').removeClass('targetElemScroll');		
					if($store.agregatorMode == 0) {
						$startOffset += $defaultLoadBy;
						loadDefaultContent($defaultPartnerLoadLimit, $startOffset);
					} else if($store.agregatorMode == 1) {
						$startOffset += $searchLoadBy;
						loadSearchResultData($searchPartnerLoadLimit, $startOffset);
					} else if($store.agregatorMode == 2) {
						$startOffset += $filterLoadBy;
						loadFiltredData($filtredPartnerLoadLimit, $startOffset);
					}
				}
			}
		});

	// Get content //

	loadDefaultContent($defaultPartnerLoadLimit, $startOffset);

	// Get search content //
	
	$("#searchSub").click(function () {
		$store.agregatorMode = 1;
		$startOffset = APP.OFFSET.PARTNERS;
		loadSearchResultData($searchPartnerLoadLimit, $startOffset);
	});

	// Get filter content //
	
	$("#find_by_filter").click(function () {
		$store.agregatorMode = 2;
		$startOffset = APP.OFFSET.PARTNERS;
		loadFiltredData($filtredPartnerLoadLimit, $startOffset);
	});

	// Load additional content 
	
	function loadDefaultContent(limit, offset) {
		$("#contentPartners").append('<div class="lds-ring"><div></div><div></div><div></div><div>');

		$.ajax({
			url: API_CONTROLLERS.MAIN_DATA,
			type: 'POST',
			dataType: 'json',
			data: { getInfoAboutAgregator: { "id": +$store.getItem("lastVisitAgregator"), "limit": limit, "offset": offset, "city": JSON.parse($store.getItem('userdata')).city } },
			success: loadDefaultContentSuccess,
			error: loadDefaultContentFail
		});
		
	}

	function loadDefaultContentSuccess(partnerdata, status, xhr) {
			$(".lds-ring").remove();

			if(partnerdata.agregatorName != undefined) {
				$(".analyticsTitle p").html(partnerdata.agregatorName);
				delete partnerdata.agregatorName;
			}

			let parentDataLength = Object.keys(partnerdata).length;

			if(parentDataLength != 0) { 
				for(i = 0; i < parentDataLength; i++) {
					let targetValue = (i == $defaultPartnerLoadLimit - 1) ? "targetElemScroll" : "";
					$("#contentPartners").append(`
						<div class="w-100 p-5 ${targetValue}">
							<div class="analyticsBox">
								<div class="w-100 d-flex align-items-center justify-content-between">
									<p class="agregatorBox_name">${partnerdata[i].name}</p>
									<p class="agregatorBox_rating">Рейтинг: 
										<span id="reting" class="reting">${partnerdata[i].rating}</span>
									</p>
								</div>
								<div class="w-100 row justify-content-between p-10">
								<div class="agregatorBox_conditions">
									<p class="agregatorBox_title">Условия работы</p>
									<div class="agregatorBox_hr"></div>
									<ul>
										<li>
											<img class="w-9 h-10 mr-10 mt-3" src="./imgs/agreratorBox_li.png" alt="&#10004;">
											<p class="fw_bold fs_20">
												<span>Комиссия парка - </span>${partnerdata[i].park_commission} %
											</p>
										</li>
										<li>
											<img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;">
											<div>
												<p>
													<span>Выплаты:</span>
												</p>
												<ul>
													<li>
														<p>${partnerdata[i].payment_types}</p>
													</li>
												</ul>
											</div>
										</li>
										<li class="d-flex flex-column">
											<div class="d-flex">
												<img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;">
												<p>
													<span>Каналы тех. поддержки:</span>
												</p>
											</div>
											<div class="agreratorBox_supportImgs" data-imgs-id="${partnerdata[i].id}"></div>
										</li>
										<li>
											<img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;">
											<p class="w-60">
												<span>Парковые автомобили:</span>
											</p>
											<div class="parkCar_Imgs" data-cars-id="${partnerdata[i].id}"></div>
										</li>
									</ul>
								</div>
								<div class="agregatorBox_agregators">
									<p class="agregatorBox_title">Агрегаторы</p>
									<div class="agregatorBox_hr"></div>
									<div class="row agregatorBox_agregatorsList" id="agregatorBox_agregatorsList" data-agregators-id="${partnerdata[i].id}"></div>
								</div>
							</div>
							<a href="./info-about-partner.html" class="ttt transition" data-parnter-id="${partnerdata[i].id}">
								<input type="button" class="driverProfile_OrangeBtn max-w-275 mt-0 mb-5" value="Перейти">
							</a>
							</div>
						</div>
					`);

					$chanelsContent = $(`.agreratorBox_supportImgs[data-imgs-id="${partnerdata[i].id}"]`);
					$chanelsArr = partnerdata[i].support_chanels;
					for(j = 0; j < Object.keys($chanelsArr).length; j++) {
						$chanelsContent.append(`
							<img src="${$chanelsArr[j].logo_url}" alt="${$chanelsArr[j].name}">`);
					}
					
					$cars = partnerdata[i].park_cars.split(";");
					if($cars[0] == "none")
						$(`.parkCar_Imgs[data-cars-id="${partnerdata[i].id}"]`).append(`
							<img src='./imgs/parkCar_no.png' alt='No'>
						`);
					else
						$(`.parkCar_Imgs[data-cars-id="${partnerdata[i].id}"]`).append(`
							<img src='./imgs/parkCar_yes.png' alt='Yes'>
						`);

					$agregatorsContent = $(`#agregatorBox_agregatorsList[data-agregators-id="${partnerdata[i].id}"]`);
					$agregatorsArr = partnerdata[i].connected_agregators;
					for(j = 0; j < Object.keys($agregatorsArr).length; j++)
						$agregatorsContent.append(`
							<div class="col30pr">
								<img src="${$agregatorsArr[j].logo_url}" alt="${$agregatorsArr[j].name}">
							</div>
						`);
				}
			} else if(parentDataLength == 0 && $startOffset == 0) {
				$("#main_content").html('<div class="row analyticsContainer" style="height: 100vh;display: flex;align-content: center;"><h2 style="color: #333333; text-align: center;">У данного агрегатора нет партнеров!</h2></div>');
			}

			$("a").click(function () {
				attrValue = $(this).attr('data-parnter-id');
				if(attrValue != undefined) { $store.setItem("lastVisitPartner", attrValue); }
			});

			$(".transition").click(function (e) {
				e.preventDefault();
				linkLocation = this.href;
				$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = linkLocation; });
			});

			retingUpdate();

			f = true;
			if($startOffset > parentDataLength + $defaultPartnerLoadLimit) { f = false; }		
	}

	function loadDefaultContentFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!");
	}

	function loadSearchResultData(limit, offset) {
		$("#contentPartners").append('<div class="lds-ring"><div></div><div></div><div></div><div>');
		
		let inputSearchData = $("#search").val();

		if(inputSearchData.replace(/\s+/gi, '') == " " || inputSearchData.replace(/\s+/gi, '') == "") {
			modalAlert("Ошибка поиска!", 1, "В поиск ничего не введено!");
		} else {
			$.ajax({
				url: API_CONTROLLERS.MAIN_DATA,
				type: 'POST',
				dataType: 'json',
				data: { search: { "id": +$store.getItem("lastVisitAgregator"), "limit": limit, "offset": offset, "search_data": inputSearchData.replace(/\s+/g, ''), "city": JSON.parse($store.getItem('userdata')).city } },
				success: loadSearchResultSuccess,
				error: loadSearchResultFail
			});
		}
	}

	function loadSearchResultSuccess(searchedPartnerdata, status, xhr) {
		let searchResultComponent = $(".search_result"),
			inputSearchData = $("#search").val();

		if($startOffset == 0) $("#contentPartners").html("");
		$(".lds-ring").remove();

		searchResultComponent.css("display", "block");
		searchResultComponent.html('<p>По Вашему запросу найдено <b id="count-of-record">#</b> партнёров</p>');

		if(searchedPartnerdata.full_count != undefined) {
			$("#count-of-record").html(searchedPartnerdata.full_count);
			delete searchedPartnerdata.full_count;
		}

		let searchedPartnerdataLength = Object.keys(searchedPartnerdata).length;

		if(searchedPartnerdataLength != 0) { 
			for(i = 0; i < searchedPartnerdataLength; i++) {
				let targetValue = (i == $searchPartnerLoadLimit - 1) ? "targetElemScroll" : "";
				$("#contentPartners").append(`
						<div class="w-100 p-5 ${targetValue}">
							<div class="analyticsBox">
								<div class="w-100 d-flex align-items-center justify-content-between">
									<p class="agregatorBox_name">${searchedPartnerdata[i].name}</p>
									<p class="agregatorBox_rating">Рейтинг: 
										<span id="reting" class="reting">${searchedPartnerdata[i].rating}</span>
									</p>
								</div>
								<div class="w-100 row justify-content-between p-10">
								<div class="agregatorBox_conditions">
									<p class="agregatorBox_title">Условия работы</p>
									<div class="agregatorBox_hr"></div>
									<ul>
										<li>
											<img class="w-9 h-10 mr-10 mt-3" src="./imgs/agreratorBox_li.png" alt="&#10004;">
											<p class="fw_bold fs_20">
												<span>Комиссия парка - </span>${searchedPartnerdata[i].park_commission} %
											</p>
										</li>
										<li>
											<img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;">
											<div>
												<p>
													<span>Выплаты:</span>
												</p>
												<ul>
													<li>
														<p>${searchedPartnerdata[i].payment_types}</p>
													</li>
												</ul>
											</div>
										</li>
										<li class="d-flex flex-column">
											<div class="d-flex">
												<img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;">
												<p>
													<span>Каналы тех. поддержки:</span>
												</p>
											</div>
											<div class="agreratorBox_supportImgs" data-imgs-id="${searchedPartnerdata[i].id}"></div>
										</li>
										<li>
											<img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;">
											<p class="w-60">
												<span>Парковые автомобили:</span>
											</p>
											<div class="parkCar_Imgs" data-cars-id="${searchedPartnerdata[i].id}"></div>
										</li>
									</ul>
								</div>
								<div class="agregatorBox_agregators">
									<p class="agregatorBox_title">Агрегаторы</p>
									<div class="agregatorBox_hr"></div>
									<div class="row agregatorBox_agregatorsList" id="agregatorBox_agregatorsList" data-agregators-id="${searchedPartnerdata[i].id}"></div>
								</div>
							</div>
							<a href="./info-about-partner.html" class="ttt transition" data-parnter-id="${searchedPartnerdata[i].id}">
								<input type="button" class="driverProfile_OrangeBtn max-w-275 mt-0 mb-5" value="Перейти">
							</a>
							</div>
						</div>
					`);

					$chanelsContent = $(`.agreratorBox_supportImgs[data-imgs-id="${searchedPartnerdata[i].id}"]`);
					$chanelsArr = searchedPartnerdata[i].support_chanels;
					for(j = 0; j < Object.keys($chanelsArr).length; j++) {
						$chanelsContent.append(`
							<img src="${$chanelsArr[j].logo_url}" alt="${$chanelsArr[j].name}">`);
					}
					
					$cars = searchedPartnerdata[i].park_cars.split(";");
					if($cars[0] == "none")
						$(`.parkCar_Imgs[data-cars-id="${searchedPartnerdata[i].id}"]`).append(`
							<img src='./imgs/parkCar_no.png' alt='No'>
						`);
					else
						$(`.parkCar_Imgs[data-cars-id="${searchedPartnerdata[i].id}"]`).append(`
							<img src='./imgs/parkCar_yes.png' alt='Yes'>
						`);

					$agregatorsContent = $(`#agregatorBox_agregatorsList[data-agregators-id="${searchedPartnerdata[i].id}"]`);
					$agregatorsArr = searchedPartnerdata[i].connected_agregators;
					for(j = 0; j < Object.keys($agregatorsArr).length; j++)
						$agregatorsContent.append(`
							<div class="col30pr">
								<img src="${$agregatorsArr[j].logo_url}" alt="${$agregatorsArr[j].name}">
							</div>
						`);
			}
		} else {
			searchResultComponent.html("<p>По запросу <b>\"" + inputSearchData + "\" </b> нечего не найдено!</p>");
		}

		$("a").click(function () {
			attrValue = $(this).attr('data-parnter-id');
			if(attrValue != undefined) { $store.setItem("lastVisitPartner", attrValue); }
		});

		$(".transition").click(function (e) {
			e.preventDefault();
			linkLocation = this.href;
			$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = linkLocation; });
		});

		retingUpdate();

		f = true;
		if($startOffset > searchedPartnerdataLength + $searchPartnerLoadLimit) { f = false; }
	}

	function loadSearchResultFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!");
	}

	function loadFiltredData(limit, offset) {
		$("#contentPartners").append('<div class="lds-ring"><div></div><div></div><div></div><div>');
		$("#find_by_filter").prop("disabled", true);

		let filtredResultComponent = $(".search_result"),
			countOfRecordComponent = $("#count-of-record");

		let filterData = {};

		let commissionData = [],
			paymentTypes = [],
			supportChannels = [],
			ratingPartners = [],
			parkCars = [];
		
		$.each($(".commission_data:checked"), function () { commissionData.push($(this).val()); });		
		$.each($(".payment_types:checked"), function () { paymentTypes.push($(this).val()); });		
		$.each($(".support_channels:checked"), function () { supportChannels.push($(this).val()); });		
		$.each($(".rating_partners:checked"), function () { ratingPartners.push($(this).val()); });		
		$.each($(".park_cars:checked"), function () { parkCars.push($(this).val()); });		

		filterData.id = $store.getItem("lastVisitAgregator");
		filterData.limit = limit;
		filterData.offset = offset;
		filterData.city = JSON.parse($store.getItem('userdata')).city;
		filterData.commissionData = commissionData;
		filterData.paymentTypes = paymentTypes;
		filterData.supportChannels = supportChannels;
		filterData.ratingPartners = ratingPartners;
		filterData.parkCars = parkCars;

		if(commissionData.length == 0) {
			modalAlert("", 1, "Должна быть выбрана хотя бы одна комиссия!", function () {
				$("#find_by_filter").prop("disabled", false);
			});
		} else if(paymentTypes.length == 0) {
			modalAlert("", 1, "Должна быть выбрана хотя бы одна выплата!", function () {
				$("#find_by_filter").prop("disabled", false);
			});
		} else if(supportChannels.length == 0) {
			modalAlert("", 1, "Должен быть выбран хотя бы один канал тех. поддержки!", function () {
				$("#find_by_filter").prop("disabled", false);
			});
		} else {
			$('#modalFilter').modal('hide');
			$("#find_by_filter").prop("disabled", false);
		}

		$.ajax({
			url: API_CONTROLLERS.MAIN_DATA,
			type: 'POST',
			dataType: 'json',
			data: { filterData: filterData },
			success: loadFiltredDataSuccess,
			error: loadFiltredDataFail
		});

	}

	function loadFiltredDataSuccess(filtredPartnerdata, status, xhr) {
		let filtredResultComponent = $(".search_result");

		if(filtredPartnerdata.full_count != undefined) {
			$("#contentPartners").html("");
			filtredResultComponent.css("display", "block");
			filtredResultComponent.html(`<p>По Вашему запросу найдено <b id="count-of-record">${filtredPartnerdata.full_count}</b> партнёров</p>`);
			delete filtredPartnerdata.full_count;
		}

		$(".lds-ring").remove();

		let filtredPartnerdataLength = Object.keys(filtredPartnerdata).length;

		if(filtredPartnerdataLength != 0) { 
			for(i = 0; i < filtredPartnerdataLength; i++) {
				let targetValue = (i == $filtredPartnerLoadLimit - 1) ? "targetElemScroll" : "";
				$("#contentPartners").append(`
						<div class="w-100 p-5 ${targetValue}">
							<div class="analyticsBox">
								<div class="w-100 d-flex align-items-center justify-content-between">
									<p class="agregatorBox_name">${filtredPartnerdata[i].name}</p>
									<p class="agregatorBox_rating">Рейтинг: 
										<span id="reting" class="reting">${filtredPartnerdata[i].rating}</span>
									</p>
								</div>
								<div class="w-100 row justify-content-between p-10">
								<div class="agregatorBox_conditions">
									<p class="agregatorBox_title">Условия работы</p>
									<div class="agregatorBox_hr"></div>
									<ul>
										<li>
											<img class="w-9 h-10 mr-10 mt-3" src="./imgs/agreratorBox_li.png" alt="&#10004;">
											<p class="fw_bold fs_20">
												<span>Комиссия парка - </span>${filtredPartnerdata[i].park_commission} %
											</p>
										</li>
										<li>
											<img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;">
											<div>
												<p>
													<span>Выплаты:</span>
												</p>
												<ul>
													<li>
														<p>${filtredPartnerdata[i].payment_types}</p>
													</li>
												</ul>
											</div>
										</li>
										<li class="d-flex flex-column">
											<div class="d-flex">
												<img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;">
												<p>
													<span>Каналы тех. поддержки:</span>
												</p>
											</div>
											<div class="agreratorBox_supportImgs" data-imgs-id="${filtredPartnerdata[i].id}"></div>
										</li>
										<li>
											<img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;">
											<p class="w-60">
												<span>Парковые автомобили:</span>
											</p>
											<div class="parkCar_Imgs" data-cars-id="${filtredPartnerdata[i].id}"></div>
										</li>
									</ul>
								</div>
								<div class="agregatorBox_agregators">
									<p class="agregatorBox_title">Агрегаторы</p>
									<div class="agregatorBox_hr"></div>
									<div class="row agregatorBox_agregatorsList" id="agregatorBox_agregatorsList" data-agregators-id="${filtredPartnerdata[i].id}"></div>
								</div>
							</div>
							<a href="./info-about-partner.html" class="ttt transition" data-parnter-id="${filtredPartnerdata[i].id}">
								<input type="button" class="driverProfile_OrangeBtn max-w-275 mt-0 mb-5" value="Перейти">
							</a>
							</div>
						</div>
					`);

					$chanelsContent = $(`.agreratorBox_supportImgs[data-imgs-id="${filtredPartnerdata[i].id}"]`);
					$chanelsArr = filtredPartnerdata[i].support_chanels;
					for(j = 0; j < Object.keys($chanelsArr).length; j++) {
						$chanelsContent.append(`
							<img src="${$chanelsArr[j].logo_url}" alt="${$chanelsArr[j].name}">`);
					}
					
					$cars = filtredPartnerdata[i].park_cars.split(";");
					if($cars[0] == "none")
						$(`.parkCar_Imgs[data-cars-id="${filtredPartnerdata[i].id}"]`).append(`
							<img src='./imgs/parkCar_no.png' alt='No'>
						`);
					else
						$(`.parkCar_Imgs[data-cars-id="${filtredPartnerdata[i].id}"]`).append(`
							<img src='./imgs/parkCar_yes.png' alt='Yes'>
						`);

					$agregatorsContent = $(`#agregatorBox_agregatorsList[data-agregators-id="${filtredPartnerdata[i].id}"]`);
					$agregatorsArr = filtredPartnerdata[i].connected_agregators;
					for(j = 0; j < Object.keys($agregatorsArr).length; j++)
						$agregatorsContent.append(`
							<div class="col30pr">
								<img src="${$agregatorsArr[j].logo_url}" alt="${$agregatorsArr[j].name}">
							</div>
						`);
			}
		} else {
			filtredResultComponent.html("<p>По выбраным Вами фильтрам нечего не найдено!</p>");
		}

		$("a").click(function () {
			attrValue = $(this).attr('data-parnter-id');
			if(attrValue != undefined) { $store.setItem("lastVisitPartner", attrValue); }
		});

		$(".transition").click(function (e) {
			e.preventDefault();
			linkLocation = this.href;
			$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = linkLocation; });
		});

		retingUpdate();

		f = true;
		if($startOffset > filtredPartnerdataLength + $filtredPartnerLoadLimit) { f = false; }
	}

	function loadFiltredDataFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!");
	}

});