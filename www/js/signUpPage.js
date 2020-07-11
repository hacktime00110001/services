$(document).ready(function () {
	if($store.emailConfirmData != undefined) {
		let userdataEmail = JSON.parse($store.emailConfirmData);
		$("#name").val(userdataEmail.name);
		$("#email").val(userdataEmail.email);
		modalEmail(userdataEmail.email, onModalOpen, onModalClose);
	}

	function onModalOpen() {
		let userdataEmail = JSON.parse($store.emailConfirmData);
		$(".pb_close").prop('disabled', true);
		let code = $(".pb_confirm_code").val().replace(/\s/g, '');
		if(code.length < 4) {
			modalAlert("Ошибка ввода данных!", 1, "Код введен не корректно!", function () { $(".pb_close").prop('disabled', false); });
		} else if(code != userdataEmail.code) {
			modalAlert("Код не подошел!", 2, "Код введен не верно!", function () { $(".pb_close").prop('disabled', false); });
		} else {
			$(".modal_w_prompt").fadeOut(0);
			$(".modal_w_prompt").remove();
			$.ajax({
				url: API_CONTROLLERS.SIGN_UP,
				type: 'POST',
				dataType: 'json',
				data: { signUp : { phonenumber: localStorage.getItem("userPhone"), password: localStorage.getItem("password"), email: userdataEmail.email, name: userdataEmail.name, user_type: localStorage.getItem("user_type") } },
				success: signUpSuccess,
				error: signUpFail
			});
		}
	}

	function onModalClose() {
		$store.removeItem('emailConfirmData');
		$("#name").val("");
		$("#email").val("");
		$('#end_reg').prop('disabled', false);
	}

	function signUpSuccess(userdata, status, xhr) {
		$store.removeItem('emailConfirmData');
		$store.clear();
		$store.setItem("userdata", JSON.stringify(userdata));
		modalAlert("Данные подтверждены!", 3, "Регистрация прошла успешно!", function () {
			$('#end_reg').prop('disabled', false);
			$store.setItem("currentPage", "confirm-profile.html");
			$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./confirm-profile.html"; });
		});
	}

	function signUpFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!", function () { $('#end_reg').prop('disabled', false); });
	}

	function passSignUp() {
		let name = $("#name").val(),
			email = $("#email").val();

		$('#end_reg').prop('disabled', 'true');

		if(name.match("^([А-Я])+([а-я]+)") == null || (name.length <= 1 || name.length >= 20)) {
			modalAlert("Ошибка ввода данных!", 1, "Имя введено не корректно!", function () { $('#end_reg').prop('disabled', false); });
		} else if(email.match("^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-0-9A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})") == null || (email.length <= 4 || email.length >= 30)) {
			modalAlert("Ошибка ввода данных!", 1, "Email введен не коректно!", function () { $('#end_reg').prop('disabled', false); });
		} else {
			$.ajax({
				url: API_CONTROLLERS.SIGN_UP,
				type: 'POST',
				dataType: 'json',
				data: { sendMail : { email: email } },
				success: sendMailSuccess,
				error: sendMailFail
			});
		}
	}

	function sendMailSuccess(userdata, status, xhr) {
		$store.emailConfirmData = JSON.stringify({
			"name": $("#name").val(),
			"email": $("#email").val(),
			"code": userdata.code
		});
		modalAlert("Данные отправлены!", 3, "Письмо было отправленно на почту! Не забудьте проверить в «Спаме»!", function () {
			modalEmail($("#email").val(), onModalOpen, onModalClose);
		});
	}

	function signUpInnerSuccess(userdata, status, xhr) {
		$store.removeItem('emailConfirmData');
		$store.clear();
		$store.setItem("userdata", JSON.stringify(userdata));
		modalAlert("Данные подтверждены!", 3, "Регистрация прошла успешно!", function () {
			$('#end_reg').prop('disabled', false);
			$store.setItem("currentPage", "confirm-profile.html");
			$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./confirm-profile.html"; });
		});
	}

	function signUpInnerFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!", function () { $('#end_reg').prop('disabled', false); });
	}

	function sendMailFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!", function () { $('#end_reg').prop('disabled', false); });
	}

	$("#end_reg").click(passSignUp);

});