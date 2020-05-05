$(document).ready(function() {

	let $store = localStorage,
		$startOffset = 0;

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
				loadDiscountsContent(10, $startOffset);
			}
		}
	});

	loadDiscountsContent(10, 0);

	function loadDiscountsContent(limit, offset) {
		$("#discContent").append('<div class="lds-ring"><div></div><div></div><div></div><div>');

		$.post("http://taxitime.pro/api/Discounts.php", { 
			getBonuses: JSON.stringify({
				"cityName": JSON.parse($store.getItem('userdata')).city,
				"limit": limit + "",
				"offset": offset + ""
			})
		}).done(function (data) {
			$(".lds-ring").remove();

			var bonuses = JSON.parse(data);

			if(bonuses.length != 0) {
				for(i = 0; i < bonuses.length; i++) {
					if(i == 9)
						$("#discContent").append('<div class="p-6 w-100 targetElemScroll"><div class="discount" data-id-disc="'+bonuses[i].id+'"><p class="colorFF8E16 fw_medium">'+bonuses[i].type_of_service+'</p><div class="agregatorBox_hr w-100"></div><div class="discount__Card w-100"><div class="front w-100 d-flex flex-column align-items-center"><img class="w-100 discountImg" src="./imgs/discount.png" alt=""><div class="discount__Img"><div class="discount__info--name"><p>'+bonuses[i].name_of_firm+'</p></div><div class="discount__info--your"><p>Твоя <span>НЕФТЬ</span></p><p>Твоя <span>ВЫГОДА</span></p></div><div class="discount__info"><p>'+bonuses[i].card_number+'</p></div><div class="discount__info2"><p>Скидка <span>'+bonuses[i].discount_percentage+'%</span></p></div></div></div><div class="back w-100 d-flex flex-column align-items-center"><div class="discount__Img--Back"><img src="./imgs/discount_reverse-arrow.png" alt=""><div><p>Условия</p></div><p class="discount__text"><span>'+bonuses[i].conditions+'</span></p></div></div></div><div class="agregatorBox_hr mt-15 mb-15 w-100"></div><input type="button" class="discount_OrangeBtn w-100" id="addition" value="Подробнее"><input type="button" class="discount_OrangeBtn w-100 d_none" id="using" value="Воспользоваться"></div></div>');
					else
						$("#discContent").append('<div class="p-6 w-100"><div class="discount" data-id-disc="'+bonuses[i].id+'"><p class="colorFF8E16 fw_medium">'+bonuses[i].type_of_service+'</p><div class="agregatorBox_hr w-100"></div><div class="discount__Card w-100"><div class="front w-100 d-flex flex-column align-items-center"><img class="w-100 discountImg" src="./imgs/discount.png" alt=""><div class="discount__Img"><div class="discount__info--name"><p>'+bonuses[i].name_of_firm+'</p></div><div class="discount__info--your"><p>Твоя <span>НЕФТЬ</span></p><p>Твоя <span>ВЫГОДА</span></p></div><div class="discount__info"><p>'+bonuses[i].card_number+'</p></div><div class="discount__info2"><p>Скидка <span>'+bonuses[i].discount_percentage+'%</span></p></div></div></div><div class="back w-100 d-flex flex-column align-items-center"><div class="discount__Img--Back"><img src="./imgs/discount_reverse-arrow.png" alt=""><div><p>Условия</p></div><p class="discount__text"><span>'+bonuses[i].conditions+'</span></p></div></div></div><div class="agregatorBox_hr mt-15 mb-15 w-100"></div><input type="button" class="discount_OrangeBtn w-100" id="addition" value="Подробнее"><input type="button" class="discount_OrangeBtn w-100 d_none" id="using" value="Воспользоваться"></div></div>');
				}

				$(".discount__Card").flip({
					trigger: 'click',
					speed: 1000
				});

				$(".discount__Card .back").on("click", function(){
					$(this).parent().find(".discount__info--name").css("visibility", "visible");
				});
				
				$(".discount__Card").on('flip:done',function() {
					let isFlip = $(this).data("flip-model");
					if(isFlip.isFlipped) {
						$(this).find(".discount__info--name").css("visibility", "hidden");
						$(this).parent().find("#using").removeClass("d_none");
						$(this).parent().find("#addition").addClass("d_none");
						$(this).find(".front img").css("overflow", "hidden");
						$(this).find(".discount__text span").slideDown(1500);
						$(this).animate({
							marginBottom: '0px'
						}, 500);
					} else {
						$(this).parent().find("#addition").removeClass("d_none");
						$(this).parent().find("#using").addClass("d_none");
						$(this).find(".front img").css("overflow", "initial");
						$(this).find(".discount__text span").slideUp(1500);
						$(this).animate({
							marginBottom: '68px'
						}, 500);
					}
				});

				$(".discount input[value='Подробнее']").on("click", function() {
					$(this).parent().find(".discount__Card").flip(true);
				});

				f = true;
				if($startOffset > bonuses.length + limit) {
					f = false;
				}
			} else if(bonuses.length == 0 && offset == 0) {
				$("#discContent").html('<div class="row analyticsContainer" style="height: 100vh;display: flex;align-content: center;"><h2 style="color: #333333; text-align: center;">В вашем городе нет скидок и бонусов!</h2></div>');
			}

		}).fail(function(xhr, textStatus, error){
			modalAlert("Server error!", 2, "Problem with server!");
		});
	}

});