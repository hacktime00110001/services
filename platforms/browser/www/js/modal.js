function modal_alert($title, $type, $msg, $confirm = function () {}) {
	$("body").prepend("<div class='modal_w_alert'><div class='message_box'><b class='mb_title'></b><div class='mb_content'><div class='mb_status_icon'></div><span class='mb_msg'></span></div><input type='button' class='mb_close' value='OK'></div></div>");
	$(".mb_title").text($title);

	switch ($type) {
		case 0: $(".mb_status_icon").addClass("mb_info"); break;
		case 1: $(".mb_status_icon").addClass("mb_warning"); break;
		case 2: $(".mb_status_icon").addClass("mb_error"); break;
		case 3: $(".mb_status_icon").addClass("mb_success"); break;
	}
	$(".mb_msg").html($msg);
	$(".modal_w_alert").fadeIn(400).css("display", "flex");

	$(".mb_close").click(function () {
		$(".modal_w_alert").fadeOut(400);
		$(".modal_w_alert").remove();
		$confirm();
	});
}

function modal_email($email, $confirm, $cancel = function () {}) {
	$("body").prepend("<div class='modal_w_prompt'><div class='prompt_box'><b class='pb_title'></b><div class='pb_content'><span class='pb_info_msg'></span><input type='text' class='pb_confirm_code' placeholder='## ##'></div><div class='pb_btns'><input type='button' class='pb_confirm' value='ПОДТВЕРДИТЬ'><input type='button' class='pb_close' value='ЗАКРЫТЬ'></div></div></div>");

	$(".pb_title").text("Подтверждение почты!");
	$(".pb_info_msg").html("<span>Введите код, который был отправлен вам на почту: " + $email + "</span>");

	$(".modal_w_prompt").fadeIn(400).css("display", "flex");
	$(".pb_confirm_code").mask("00 00");
	
	$(".pb_confirm").click($confirm);

	$(".pb_close").click(function () {
		$cancel();
		$(".modal_w_prompt").fadeOut(400);
		$(".modal_w_prompt").remove();
	});
}