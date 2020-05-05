$(document).ready(function () {

	let $store = localStorage,
		$startOffset = 0;

	$store.agregatorMode = 0;

	$("#agregatorSearchBtn").on("click", function() {
		$("#agregatorSearchContainer").fadeToggle("slow", "linear");
	}); 

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
					$startOffset += 10;
					if($store.agregatorMode == 0)
						loadDefaultContent(10, $startOffset);
					else if($store.agregatorMode == 1)
						loadSearchResultData(10, $startOffset);
					else if($store.agregatorMode == 2)
						loadFiltredData(10, $startOffset);
				}
			}
		});

	// Get content //

	loadDefaultContent(10, 0);

	// Get search content //
	
	$("#searchSub").click(function () {
		$store.agregatorMode = 1;
		$startOffset = 0;
		loadSearchResultData(10, 0);
	});

	// Get filter content //
	
	$("#find_by_filter").click(function () {
		$store.agregatorMode = 2;
		$startOffset = 0;
		loadFiltredData(10, 0);
	});

	// Load additional content 
	
	function loadDefaultContent(limit, offset) {
		$("#contentPartners").append('<div class="lds-ring"><div></div><div></div><div></div><div>');

		$.post("http://taxitime.pro/api/MainData.php", { 
			getInfoAboutAgregator: JSON.stringify({
				"id": $store.getItem("lastVisitAgregator"),
				"limit": limit + "",
				"offset": offset + "",
				"cityName": JSON.parse($store.getItem('userdata')).city
			})
		}).done(function (data) {
			$(".lds-ring").remove();

			let contentData = JSON.parse(data);
			if(offset == 0)
				$(".analyticsTitle p").html(contentData[1].name);

			if(contentData[0].length != 0) { 
				for(i = 0; i < contentData[0].length; i++) {
					if(i == 9)
						$("#contentPartners").append('<div class="w-100 p-5 targetElemScroll"><div class="analyticsBox"><div class="w-100 d-flex align-items-center justify-content-between"><p class="agregatorBox_name">'+contentData[0][i].name+'</p><p class="agregatorBox_rating">Рейтинг: <span id="reting" class="reting">'+contentData[0][i].rating+'</span></p></div><div class="w-100 row justify-content-between p-10"><div class="agregatorBox_conditions"><p class="agregatorBox_title">Условия работы</p><div class="agregatorBox_hr"></div><ul><li><img class="w-9 h-10 mr-10 mt-3" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p class="fw_bold fs_20"><span>Комиссия парка - </span>'+contentData[0][i].park_commission+' %</p></li><li><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><div><p><span>Выплаты:</span></p><ul><li><p>'+contentData[0][i].payment_types+'</p></li></ul></div></li><li class="d-flex flex-column"><div class="d-flex"><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p><span>Каналы тех. поддержки:</span></p></div><div class="agreratorBox_supportImgs" data-imgs-id=\''+contentData[0][i].id+'\'></div></li><li><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p class="w-60"><span>Парковые автомобили:</span></p><div class="parkCar_Imgs" data-cars-id=\''+contentData[0][i].id+'\'></div></li></ul></div><div class="agregatorBox_agregators"><p class="agregatorBox_title">Агрегаторы</p><div class="agregatorBox_hr"></div><div class="row agregatorBox_agregatorsList" id="agregatorBox_agregatorsList" data-agregators-id=\''+contentData[0][i].id+'\'></div></div></div><a href="./info-about-partner.html" class="ttt transition" data-parnter-id='+contentData[0][i].id+'><input type="button" class="driverProfile_OrangeBtn max-w-275 mt-0 mb-5" value="Перейти"></a></div></div>');
					else
						$("#contentPartners").append('<div class="w-100 p-5"><div class="analyticsBox"><div class="w-100 d-flex align-items-center justify-content-between"><p class="agregatorBox_name">'+contentData[0][i].name+'</p><p class="agregatorBox_rating">Рейтинг: <span id="reting" class="reting">'+contentData[0][i].rating+'</span></p></div><div class="w-100 row justify-content-between p-10"><div class="agregatorBox_conditions"><p class="agregatorBox_title">Условия работы</p><div class="agregatorBox_hr"></div><ul><li><img class="w-9 h-10 mr-10 mt-3" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p class="fw_bold fs_20"><span>Комиссия парка - </span>'+contentData[0][i].park_commission+' %</p></li><li><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><div><p><span>Выплаты:</span></p><ul><li><p>'+contentData[0][i].payment_types+'</p></li></ul></div></li><li class="d-flex flex-column"><div class="d-flex"><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p><span>Каналы тех. поддержки:</span></p></div><div class="agreratorBox_supportImgs" data-imgs-id=\''+contentData[0][i].id+'\'></div></li><li><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p class="w-60"><span>Парковые автомобили:</span></p><div class="parkCar_Imgs" data-cars-id=\''+contentData[0][i].id+'\'></div></li></ul></div><div class="agregatorBox_agregators"><p class="agregatorBox_title">Агрегаторы</p><div class="agregatorBox_hr"></div><div class="row agregatorBox_agregatorsList" id="agregatorBox_agregatorsList" data-agregators-id=\''+contentData[0][i].id+'\'></div></div></div><a href="./info-about-partner.html" class="ttt transition" data-parnter-id='+contentData[0][i].id+'><input type="button" class="driverProfile_OrangeBtn max-w-275 mt-0 mb-5" value="Перейти"></a></div></div>');
					
					$chanelsContent = $(".agreratorBox_supportImgs[data-imgs-id='"+contentData[0][i].id+"']");
					for(j = 0; j < contentData[0][i][0].support_channels.length; j++)
						$chanelsContent.append("<img src='"+contentData[0][i][0].support_channels[j].logo_url+"' alt='"+contentData[0][i][0].support_channels[j].name+"'>");
					
					$cars = contentData[0][i].park_cars.split(";");
					if($cars[0] == "none")
						$(".parkCar_Imgs[data-cars-id='"+contentData[0][i].id+"']").append("<img src='./imgs/parkCar_no.png' alt='No'>");
					else
						$(".parkCar_Imgs[data-cars-id='"+contentData[0][i].id+"']").append("<img src='./imgs/parkCar_yes.png' alt='Yes'>");

					$agregatorsContent = $("#agregatorBox_agregatorsList[data-agregators-id='"+contentData[0][i].id+"']");
					for(j = 0; j < contentData[0][i][1].some_info_agregators.length; j++)
						$agregatorsContent.append("<div class='col30pr'><img src='"+contentData[0][i][1].some_info_agregators[j].logo_url+"' alt='"+contentData[0][i][1].some_info_agregators[j].name+"'></div>");
					
				}
			} else if(contentData[0].length == 0 && offset == 0) {
				$("#main_content").html('<div class="row analyticsContainer" style="height: 100vh;display: flex;align-content: center;"><h2 style="color: #333333; text-align: center;">У данного агрегатора нет партнеров!</h2></div>');
			}

			$("a").click(function () {
				attrValue = $(this).attr('data-parnter-id');
				if(attrValue != undefined) {
					$store.setItem("lastVisitPartner", attrValue);
				}
			});

			$(".transition").click(function (e) {
				e.preventDefault();
				linkLocation = this.href;
				$("body").fadeOut(1000, function () {
					window.location = linkLocation;
				});
			});

			retingUpdate();

			f = true;
			if($startOffset > contentData[0].length + limit) {
				f = false;
			}

		}).fail(function(xhr, textStatus, error) {
			modalAlert("Server error!", 2, "Problem with server!");
		});
	}

	function loadSearchResultData(limit, offset) {
		$("#contentPartners").append('<div class="lds-ring"><div></div><div></div><div></div><div>');

		var searchRessultDiv = $(".search_result");
		var countOfRecordComponent = $("#count-of-record");
		var contentDiv = $("#contentPartners");
		var inputSearchData = $("#search").val();

		if(inputSearchData.replace(/\s+/g, '') == " " || inputSearchData.replace(/\s+/g, '') == "") {
			modalAlert("Ошибка поиска!", 1, "В поиск ничего не введено!");
		} else {
			$.post("http://taxitime.pro/api/MainData.php", { 
				searchData: JSON.stringify({
					"id": $store.getItem("lastVisitAgregator"),
					"limit": limit + "",
					"offset": offset + "",
					"name": inputSearchData.replace(/\s+/g, ''),
					"cityName": JSON.parse($store.getItem('userdata')).city
				})
			}).done(function (data) {
				if(offset == 0) {
					contentDiv.html("");
				}
				$(".lds-ring").remove();

				searchRessultDiv.css("display", "block");

				let searchResultData = JSON.parse(data);
				searchRessultDiv.html('<p>По Вашему запросу найдено <b id="count-of-record">#</b> партнёров</p>');
				countOfRecordComponent = $("#count-of-record");

				if(offset == 0)
					countOfRecordComponent.html(searchResultData[1].fullCount);

				if(searchResultData[0].length != 0) { 
					for(i = 0; i < searchResultData[0].length; i++) {
						if(i == 9)
							contentDiv.append('<div class="w-100 p-5 targetElemScroll"><div class="analyticsBox"><div class="w-100 d-flex align-items-center justify-content-between"><p class="agregatorBox_name">'+searchResultData[0][i].name+'</p><p class="agregatorBox_rating">Рейтинг: <span id="reting" class="reting">'+searchResultData[0][i].rating+'</span></p></div><div class="w-100 row justify-content-between p-10"><div class="agregatorBox_conditions"><p class="agregatorBox_title">Условия работы</p><div class="agregatorBox_hr"></div><ul><li><img class="w-9 h-10 mr-10 mt-3" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p class="fw_bold fs_20"><span>Комиссия парка - </span>'+searchResultData[0][i].park_commission+' %</p></li><li><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><div><p><span>Выплаты:</span></p><ul><li><p>'+searchResultData[0][i].payment_types+'</p></li></ul></div></li><li class="d-flex flex-column"><div class="d-flex"><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p><span>Каналы тех. поддержки:</span></p></div><div class="agreratorBox_supportImgs" data-imgs-id=\''+searchResultData[0][i].id+'\'></div></li><li><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p class="w-60"><span>Парковые автомобили:</span></p><div class="parkCar_Imgs" data-cars-id=\''+searchResultData[0][i].id+'\'></div></li></ul></div><div class="agregatorBox_agregators"><p class="agregatorBox_title">Агрегаторы</p><div class="agregatorBox_hr"></div><div class="row agregatorBox_agregatorsList" id="agregatorBox_agregatorsList" data-agregators-id=\''+searchResultData[0][i].id+'\'></div></div></div><a href="./info-about-partner.html" class="ttt transition" data-parnter-id='+searchResultData[0][i].id+'><input type="button" class="driverProfile_OrangeBtn max-w-275 mt-0 mb-5" value="Перейти"></a></div></div>');
						else
							contentDiv.append('<div class="w-100 p-5"><div class="analyticsBox"><div class="w-100 d-flex align-items-center justify-content-between"><p class="agregatorBox_name">'+searchResultData[0][i].name+'</p><p class="agregatorBox_rating">Рейтинг: <span id="reting" class="reting">'+searchResultData[0][i].rating+'</span></p></div><div class="w-100 row justify-content-between p-10"><div class="agregatorBox_conditions"><p class="agregatorBox_title">Условия работы</p><div class="agregatorBox_hr"></div><ul><li><img class="w-9 h-10 mr-10 mt-3" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p class="fw_bold fs_20"><span>Комиссия парка - </span>'+searchResultData[0][i].park_commission+' %</p></li><li><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><div><p><span>Выплаты:</span></p><ul><li><p>'+searchResultData[0][i].payment_types+'</p></li></ul></div></li><li class="d-flex flex-column"><div class="d-flex"><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p><span>Каналы тех. поддержки:</span></p></div><div class="agreratorBox_supportImgs" data-imgs-id=\''+searchResultData[0][i].id+'\'></div></li><li><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p class="w-60"><span>Парковые автомобили:</span></p><div class="parkCar_Imgs" data-cars-id=\''+searchResultData[0][i].id+'\'></div></li></ul></div><div class="agregatorBox_agregators"><p class="agregatorBox_title">Агрегаторы</p><div class="agregatorBox_hr"></div><div class="row agregatorBox_agregatorsList" id="agregatorBox_agregatorsList" data-agregators-id=\''+searchResultData[0][i].id+'\'></div></div></div><a href="./info-about-partner.html" class="ttt transition" data-parnter-id='+searchResultData[0][i].id+'><input type="button" class="driverProfile_OrangeBtn max-w-275 mt-0 mb-5" value="Перейти"></a></div></div>');
						
						$chanelsContent = $(".agreratorBox_supportImgs[data-imgs-id='"+searchResultData[0][i].id+"']");
						for(j = 0; j < searchResultData[0][i][0].support_channels.length; j++)
							$chanelsContent.append("<img src='"+searchResultData[0][i][0].support_channels[j].logo_url+"' alt='"+searchResultData[0][i][0].support_channels[j].name+"'>");
						
						$cars = searchResultData[0][i].park_cars.split(";");
						if($cars[0] == "none")
							$(".parkCar_Imgs[data-cars-id='"+searchResultData[0][i].id+"']").append("<img src='./imgs/parkCar_no.png' alt='No'>");
						else
							$(".parkCar_Imgs[data-cars-id='"+searchResultData[0][i].id+"']").append("<img src='./imgs/parkCar_yes.png' alt='Yes'>");

						$agregatorsContent = $("#agregatorBox_agregatorsList[data-agregators-id='"+searchResultData[0][i].id+"']");
						for(j = 0; j < searchResultData[0][i][1].some_info_agregators.length; j++)
							$agregatorsContent.append("<div class='col30pr'><img src='"+searchResultData[0][i][1].some_info_agregators[j].logo_url+"' alt='"+searchResultData[0][i][1].some_info_agregators[j].name+"'></div>");
						
					}
				} else {
					searchRessultDiv.html("<p>По запросу <b>\"" + inputSearchData + "\" </b> нечего не найдено!</p>");
				}

				$("a").click(function () {
					attrValue = $(this).attr('data-parnter-id');
					if(attrValue != undefined) {
						$store.setItem("lastVisitPartner", attrValue);
					}
				});

				$(".transition").click(function (e) {
					e.preventDefault();
					linkLocation = this.href;
					$("body").fadeOut(1000, function () {
						window.location = linkLocation;
					});
				});

				retingUpdate();

				f = true;
				if($startOffset > searchResultData[0].length + limit) {
					f = false;
				}
			}).fail(function(xhr, textStatus, error) {
				modalAlert("Server error!", 2, "Problem with server!");
			});
		}
	}

	function loadFiltredData(limit, offset) {
		$("#contentPartners").append('<div class="lds-ring"><div></div><div></div><div></div><div>');

		$("#find_by_filter").prop("disabled", true);

		let searchRessultDiv = $(".search_result"),
			countOfRecordComponent = $("#count-of-record"),
			contentDiv = $("#contentPartners");

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
		filterData.limit = limit + "";
		filterData.offset = offset + "";
		filterData.cityName = JSON.parse($store.getItem('userdata')).city;
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

		$.post("http://taxitime.pro/api/MainData.php", { 
			filterData: JSON.stringify(filterData)
		}).done(function (data) {
			if(offset == 0) {
				contentDiv.html("");
				searchRessultDiv.css("display", "block");
				searchRessultDiv.html('<p>По Вашему запросу найдено <b id="count-of-record">#</b> партнёров</p>');
				countOfRecordComponent = $("#count-of-record");
			}
			$(".lds-ring").remove();

			let filterResultData = JSON.parse(data);

			if(offset == 0) {
				countOfRecordComponent.html(filterResultData[1].fullCount);
			}

			if(filterResultData[0].length != 0) { 
				for(i = 0; i < filterResultData[0].length; i++) {
					if(i == 9)
						contentDiv.append('<div class="w-100 p-5 targetElemScroll"><div class="analyticsBox"><div class="w-100 d-flex align-items-center justify-content-between"><p class="agregatorBox_name">'+filterResultData[0][i].name+'</p><p class="agregatorBox_rating">Рейтинг: <span id="reting" class="reting">'+filterResultData[0][i].rating+'</span></p></div><div class="w-100 row justify-content-between p-10"><div class="agregatorBox_conditions"><p class="agregatorBox_title">Условия работы</p><div class="agregatorBox_hr"></div><ul><li><img class="w-9 h-10 mr-10 mt-3" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p class="fw_bold fs_20"><span>Комиссия парка - </span>'+filterResultData[0][i].park_commission+' %</p></li><li><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><div><p><span>Выплаты:</span></p><ul><li><p>'+filterResultData[0][i].payment_types+'</p></li></ul></div></li><li class="d-flex flex-column"><div class="d-flex"><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p><span>Каналы тех. поддержки:</span></p></div><div class="agreratorBox_supportImgs" data-imgs-id=\''+filterResultData[0][i].id+'\'></div></li><li><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p class="w-60"><span>Парковые автомобили:</span></p><div class="parkCar_Imgs" data-cars-id=\''+filterResultData[0][i].id+'\'></div></li></ul></div><div class="agregatorBox_agregators"><p class="agregatorBox_title">Агрегаторы</p><div class="agregatorBox_hr"></div><div class="row agregatorBox_agregatorsList" id="agregatorBox_agregatorsList" data-agregators-id=\''+filterResultData[0][i].id+'\'></div></div></div><a href="./info-about-partner.html" class="ttt transition" data-parnter-id='+filterResultData[0][i].id+'><input type="button" class="driverProfile_OrangeBtn max-w-275 mt-0 mb-5" value="Перейти"></a></div></div>');
					else
						contentDiv.append('<div class="w-100 p-5"><div class="analyticsBox"><div class="w-100 d-flex align-items-center justify-content-between"><p class="agregatorBox_name">'+filterResultData[0][i].name+'</p><p class="agregatorBox_rating">Рейтинг: <span id="reting" class="reting">'+filterResultData[0][i].rating+'</span></p></div><div class="w-100 row justify-content-between p-10"><div class="agregatorBox_conditions"><p class="agregatorBox_title">Условия работы</p><div class="agregatorBox_hr"></div><ul><li><img class="w-9 h-10 mr-10 mt-3" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p class="fw_bold fs_20"><span>Комиссия парка - </span>'+filterResultData[0][i].park_commission+' %</p></li><li><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><div><p><span>Выплаты:</span></p><ul><li><p>'+filterResultData[0][i].payment_types+'</p></li></ul></div></li><li class="d-flex flex-column"><div class="d-flex"><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p><span>Каналы тех. поддержки:</span></p></div><div class="agreratorBox_supportImgs" data-imgs-id=\''+filterResultData[0][i].id+'\'></div></li><li><img class="w-9 h-10 mr-10" src="./imgs/agreratorBox_li.png" alt="&#10004;"><p class="w-60"><span>Парковые автомобили:</span></p><div class="parkCar_Imgs" data-cars-id=\''+filterResultData[0][i].id+'\'></div></li></ul></div><div class="agregatorBox_agregators"><p class="agregatorBox_title">Агрегаторы</p><div class="agregatorBox_hr"></div><div class="row agregatorBox_agregatorsList" id="agregatorBox_agregatorsList" data-agregators-id=\''+filterResultData[0][i].id+'\'></div></div></div><a href="./info-about-partner.html" class="ttt transition" data-parnter-id='+filterResultData[0][i].id+'><input type="button" class="driverProfile_OrangeBtn max-w-275 mt-0 mb-5" value="Перейти"></a></div></div>');
					
					$chanelsContent = $(".agreratorBox_supportImgs[data-imgs-id='"+filterResultData[0][i].id+"']");
					for(j = 0; j < filterResultData[0][i][0].support_channels.length; j++)
						$chanelsContent.append("<img src='"+filterResultData[0][i][0].support_channels[j].logo_url+"' alt='"+filterResultData[0][i][0].support_channels[j].name+"'>");
					
					$cars = filterResultData[0][i].park_cars.split(";");
					if($cars[0] == "none")
						$(".parkCar_Imgs[data-cars-id='"+filterResultData[0][i].id+"']").append("<img src='./imgs/parkCar_no.png' alt='No'>");
					else
						$(".parkCar_Imgs[data-cars-id='"+filterResultData[0][i].id+"']").append("<img src='./imgs/parkCar_yes.png' alt='Yes'>");

					$agregatorsContent = $("#agregatorBox_agregatorsList[data-agregators-id='"+filterResultData[0][i].id+"']");
					for(j = 0; j < filterResultData[0][i][1].some_info_agregators.length; j++)
						$agregatorsContent.append("<div class='col30pr'><img src='"+filterResultData[0][i][1].some_info_agregators[j].logo_url+"' alt='"+filterResultData[0][i][1].some_info_agregators[j].name+"'></div>");
					
				}
			} else {
				searchRessultDiv.html("<p>По выбраным Вами фильтрам нечего не найдено!</p>");
			}

			$("a").click(function () {
				attrValue = $(this).attr('data-parnter-id');
				if(attrValue != undefined) {
					$store.setItem("lastVisitPartner", attrValue);
				}
			});

			$(".transition").click(function (e) {
				e.preventDefault();
				linkLocation = this.href;
				$("body").fadeOut(1000, function () {
					window.location = linkLocation;
				});
			});

			retingUpdate();

			f = true;
			if($startOffset > filterResultData[0].length + limit) {
				f = false;
			}

		}).fail(function(xhr, textStatus, error) {
			modalAlert("Server error!", 2, "Problem with server!");
		});
	}

});