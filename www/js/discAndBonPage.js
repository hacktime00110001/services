$(document).ready(function(){

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

});