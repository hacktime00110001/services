$(document).ready(function() {
	let seconds = 179,
		firstAuth = $store.getItem("firstAuth");
		
	if(firstAuth === "1") {
		$(".numberLogo").before("<div class='num_info_for_users'>На номер <span id='user_entered_pn's>+7 000 000 00 00</span> было отправленно сообщение!</div>");
		$("#user_entered_pn").text($store.getItem("userPhone"));
		$(".codeInfo").after("<div class='request_in_support'>Если номер телефона введен неверно вы можете <span id='correct_pn'>исправить номер</span> или обратится в <span id='request_in_support'>службу поддержки</span></div>");
		$.ajax({
			url: API_CONTROLLERS.SIGN_UP,
			type: 'POST',
			dataType: 'json',
			data: { checkCountsOfTry : { phonenumber: $store.getItem("userPhone") } },
			success: checkCountsOfTrySuccess,
			error: checkCountsOfTryFail
		});
	} else if(firstAuth === "0") {
		$(".codeInfo").after("<div class='request_in_support'>Если номер телефона введен неверно вы можете <span id='correct_pn'>исправить номер</span> или обратится в <span id='request_in_support'>службу поддержки</span></div>");
		$(".codeInfo").empty();
		$(".codeInfo").html("<b><span id='forgot_password'>Забыли пароль?</span></b>");
		$("#forgot_password").bind("click", clickByForgotPassword);
	} else {
 		$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./sign-in.html"; });
	}

	function checkCountsOfTrySuccess(userdata, status, xhr) {
		if(userdata.countOfTry != "2") {
			intervalToNextAttempt = setInterval(function () {
				if(seconds != -1) {
					if(seconds % 60 > 9) $("#next_attempt").text("0"+ parseInt(seconds / 60) +":"+ (seconds-- % 60) );
					else $("#next_attempt").text("0"+ parseInt(seconds / 60) +":0"+ (seconds-- % 60) );
				} else {
					clearInterval(intervalToNextAttempt);
					$(".codeInfo").empty();
					$(".codeInfo").html("<b><span id='one_attempt'>Отправить код еще раз!</span></b>");
					$("#one_attempt").bind("click", clickByOneMore);
				}
			}, 1000);
		} else {
			$(".codeInfo").empty();
			$(".codeInfo").html("<p class='codeInfoAfter'>Вы исчерпали попытки!</p>");
		}
	}

	function checkCountsOfTryFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!");
	}

	$("#conf-code").pinlogin({
		fields: 6,
		hideinput: false,
		reset: true,
		complete: pinCodeEntered
	});

	function pinCodeEntered(pin) {
		$.ajax({
			url: API_CONTROLLERS.SIGN_UP,
			type: 'POST',
			dataType: 'json',
			data: { checkUserEnterPin : { pincode: pin } }, 
			success: checkUserEnterPinSuccess,
			error: checkUserEnterPinFail
		});	
	}

	function checkUserEnterPinSuccess(userdata, status, xhr) {
		if(userdata.encPin == $store.getItem("password") && firstAuth != "1") {
			modalAlert("Информация!", 0, "Вы успешно авторизовались!");
			$(".mb_close").click(getAuthData);
		} else if(userdata.encPin == $store.getItem("password") && firstAuth === "1") {
			$.ajax({
				url: API_CONTROLLERS.SIGN_UP,
				type: 'POST',
				dataType: 'json',
				data: { updateIsReg : { phonenumber: $store.getItem("userPhone") } }, 
				success: passConfirmCodeSuccess,
				error: passConfirmCodeFail
			});	
		} else {
			modalAlert("Предупреждение!", 1, "Код введен не верно, попробуйте снова!");
		}
	}

	function checkUserEnterPinFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!");
	}

	function getAuthData() {
		$.ajax({
			url: API_CONTROLLERS.SIGN_IN,
			type: 'POST',
			dataType: 'json',
			data: { signIn : { phonenumber: $store.getItem("userPhone") } },
			success: userSignInSuccess,
			error: userSignInFail
		});	
	}

	function userSignInSuccess(userdata, status, xhr) {
		$store.clear();
		$store.setItem("userdata", JSON.stringify(userdata));
		if(userdata.status == "0") {
			$store.setItem("currentPage", "confirm-profile.html");
			$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./confirm-profile.html"; });
		} else {
			$store.setItem("currentPage", "profile.html");
			$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./profile.html"; });
		}
	}

	function userSignInFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!");
	}

	function passConfirmCodeSuccess(userdata, status, xhr) {
		$store.setItem("currentPage", "sign-up.html");
		$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./sign-up.html"; });
	}

	function passConfirmCodeFail(jqXhr, textStatus, errorMessage) {
		console.log(jqXhr.responseText);
		modalAlert("Server error!", 2, "Problem with server!");
	}

	function clickByOneMore() {
		$(".codeInfo").empty();
		$(".codeInfo").html("<p class='codeInfoAfter'>Код был отправлен!</p>");
		$.ajax({
			url: API_CONTROLLERS.SIGN_UP,
			type: 'POST',
			dataType: 'json',
			data: { updateCountOfTry : { phonenumber: $store.getItem("userPhone") } },
			success: tryChangePasswordSuccess,
			error: tryChangePasswordFail
		});	
	}

	function tryChangePasswordSuccess(userdata, status, xhr) {
		$store.setItem("password", userdata.newPassword);
		modalAlert("Информация", 3, "Код был отправлен!");
	}

	function tryChangePasswordFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!");
	}

	function clickByForgotPassword() {
		$(".codeInfo").empty();
		$(".codeInfo").html("<p class='codeInfoAfter'>Пароль был отправлен!</p>");
		$.ajax({
			url: API_CONTROLLERS.SIGN_IN,
			type: 'POST',
			dataType: 'json',
			data: { forgotPassword : { phonenumber: $store.getItem("userPhone") } },
			success: forgotPasswordSuccess,
			error: forgotPasswordFail
		});	
	};

	function forgotPasswordSuccess(userdata, status, xhr) {
		$store.setItem("password", userdata.newPassword);
		modalAlert("Информация", 3, "Пароль был отпарвлен на почту привязанную к этому номеру телефона! Не забудьте проверить в «Спаме»!");
	}

	function forgotPasswordFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!");
	}

	$("#correct_pn").click(function () {
		window.localStorage.clear();
		modalAlert("Предупреждение", 1, "Введите номер телефона заново, будьте внимательнее :)", function () {
			$store.setItem("currentPage", "sign-in.html");
			$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./sign-in.html"; });
		});
	});

    $("#request_in_support").click(function () {
        $store.setItem("currentPage", "support.html");
        $store.setItem("lastPage", "sign-in.html");
        $("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./support.html"; }); 
    });

});