$(document).ready(function() {

    let $store = localStorage,
        $startOffset = APP.OFFSET.DISCOUNTS,
        $discLoadLimit = APP.LOAD_LIMIT.DISCOUNTS;

	let f = true;
	$(window).scroll(function() {
		if (f) {
			target = $('.targetElemScroll');
			if (target.offset() != undefined) {
				targetPos = target.offset().top;
			} else {
				f = false;
			}
			winHeight = $(window).height();
			scrollToElem = targetPos - winHeight;
			winScrollTop = $(this).scrollTop();
			if (winScrollTop > scrollToElem && f) {
				f = false;
				$('.targetElemScroll').removeClass('targetElemScroll');
				$startOffset += $discLoadLimit;
				loadDiscountsContent($discLoadLimit, $startOffset, current_city);
			}
		}
	});

	let $cityList = $("#selectCat");

	let user_store_data = JSON.parse($store.getItem("userdata"));
	let current_city = user_store_data.city;

	$("#selectCat").bind("change", function () {
		current_city = $("#getCity").text();
		$("#discContent").html("");
		$startOffset = APP.OFFSET.DISCOUNTS;
		loadDiscountsContent($discLoadLimit, 0, current_city);
	});

	loadDiscountsContent($discLoadLimit, 0, current_city);

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

    function loadDiscountsContent(limit, offset, current_city) {
        $("#discContent").append('<div class="lds-ring"><div></div><div></div><div></div><div>');
        $.ajax({
            url: API_CONTROLLERS.DISCOUNTS,
            type: 'POST',
            dataType: 'json',
            data: { getBonuses: { "city": current_city, "limit": limit + "", "offset": offset + "" } },
            success: discountsLoadBySuccess,
            error: discountsLoadByFail
        });
    }

    function discountsLoadBySuccess(bonuses, status, xhr) {
        $(".lds-ring").remove();
        if (bonuses.length != 0) {
            for (i = 0; i < bonuses.length; i++) {
				let targetValue = (i == $discLoadLimit - 1) ? "targetElemScroll" : "";
				let isExistAdditionUrl = false;
				if(bonuses[i].addition_info_url != undefined)
                	isExistAdditionUrl = (bonuses[i].addition_info_url.toLowerCase().trim()) != "none" ? true : false;
                $("#discContent").append(`
					<div class="p-6 w-100 ${targetValue}">
						<div class="discount" data-id-disc="${bonuses[i].id}">
							<p class="colorFF8E16 fw_medium">${bonuses[i].type_of_service}</p>
							<div class="agregatorBox_hr w-100"></div>
							<div class="discount__Card w-100">
								<div class="front w-100 d-flex flex-column align-items-center">
									<img class="w-100 discountImg" src="./imgs/discount.png" alt="">
									<div class="discount__Img"><div class="discount__info--name">
										<p>${bonuses[i].name_of_firm}</p>
									</div>
									<div class="discount__info--your">
										<p>Твоя <span>НЕФТЬ</span></p>
										<p>Твоя <span>ВЫГОДА</span></p>
									</div>
									<div class="discount__info">
										<p>${bonuses[i].card_number}</p>
									</div>
									<div class="discount__info2">
										<p>Скидка <span>${bonuses[i].discount_percentage}</span></p>
									</div>
								</div>
							</div>
							<div class="back w-100 d-flex flex-column align-items-center">
								<div class="discount__Img--Back">
									<img src="./imgs/discount_reverse-arrow.png" alt="">
									<div>
										<p>Условия</p>
									</div>
									<p class="discount__text"><span>${bonuses[i].conditions}</span></p>
								</div>
							</div>
						</div>
						<div class="agregatorBox_hr mt-15 mb-15 w-100"></div>
						<input type="button" class="discount_OrangeBtn w-100" id="addition" value="Подробнее">
						<input type="button" class="discount_OrangeBtn w-100 d_none" id="using" data-url="${isExistAdditionUrl}" url="${bonuses[i].addition_info_url}" value="Воспользоваться">
					</div>
				</div>
				`);
            }

            $(".discount__Card").flip({ trigger: 'click', speed: 1000 });
            $(".discount__Card .back").on("click", function() { $(this).parent().find(".discount__info--name").css("visibility", "visible"); });

            $(".discount__Card").on('flip:done', function() {
                let isFlip = $(this).data("flip-model");
                if (isFlip.isFlipped) {
                    $(this).find(".discount__info--name").css("visibility", "hidden");
                    if ($(this).parent().find("#using").attr("data-url") == "true") {
                        $(this).parent().find("#using").removeClass("d_none");
                        $(this).parent().find("#using").bind("click", function() {
                            location.href = $(this).parent().find("#using").attr("url");
                        });
                    }
                    $(this).parent().find("#addition").addClass("d_none");
                    $(this).find(".front img").css("overflow", "hidden");
                    $(this).find(".discount__text span").slideDown(1500);
                    $(this).animate({ marginBottom: '0px' }, 500);
                } else {
                    $(this).parent().find("#addition").removeClass("d_none");
                    if ($(this).parent().find("#using").attr("data-url") == "true") {
                        $(this).parent().find("#using").addClass("d_none");
                        $(this).parent().find("#using").unbind("click");
                    }
                    $(this).find(".front img").css("overflow", "initial");
                    $(this).find(".discount__text span").slideUp(1500);
                    $(this).animate({ marginBottom: '68px' }, 500);
                }
            });

            $(".discount input[value='Подробнее']").on("click", function() {
                $(this).parent().find(".discount__Card").flip(true);
            });

            f = true;
            if ($startOffset > bonuses.length + $discLoadLimit) {
                f = false;
            }
        } else if (bonuses.length == 0 && $startOffset == 0) {
            $("#discContent").html(`
				<div class="row analyticsContainer" style="height: 100vh;display: flex;align-content: center;">
					<h2 style="color: #333333; text-align: center;">В вашем городе нет скидок и бонусов!</h2>
				</div>
			`);
        }
    }

    function discountsLoadByFail(jqXhr, textStatus, errorMessage) {
        modalAlert("Server error!", 2, "Problem with server!");
    }

});