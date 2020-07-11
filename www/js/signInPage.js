$(document).ready(function() {

	$(".project_name").text(APP.PROJECT_NAME);
	$(".project_website").text(APP.PROJECT_WEBSITE);

	let $phonenumber = $("#phonenumber");

	$phonenumber.mask("+7 000 000 00 00");

	$phonenumber.keyup(function(e) {
		e.preventDefault();
		if (e.keyCode === 13)
			sendData();
		if($phonenumber.val().length < 4)
			$phonenumber.val("+7 ");
	});

	function sendData() {
		$('#submit').prop('disabled', 'true');
		if($phonenumber.val().length == 16) {
			$.ajax({
				url: API_CONTROLLERS.SIGN_IN,
				type: 'POST',
				dataType: 'json',
				data: { sendPhone : { phonenumber : $phonenumber.val() } },
				success: userExistenceCheckSuccess,
				error: userExistenceCheckFail
			});
		} else {
			modalAlert("Ошибка ввода данных", 2, "Номер телефона введен не корректно!", function () {
				$('#submit').prop('disabled', false);
			});
		}
	}
	
	function userExistenceCheckSuccess(userdata, status, xhr) {
		if(userdata.password !== null) {
			$store.setItem("currentPage", "confirmation-code.html");
			$store.setItem("firstAuth", "0");
			$store.setItem("userPhone", $phonenumber.val());
			$store.setItem("password", userdata.password);
			$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./confirmation-code.html"; });
		} else {
			$.ajax({
				url: API_CONTROLLERS.SIGN_UP,
				type: 'POST',
				dataType: 'json',
				data: { sendPhone : { phonenumber : $phonenumber.val(), user_type: localStorage.getItem("user_type") } },
				success: userNotExistenceCheckSuccess,
				error: userNotExistenceCheckFail
			});
		}
	}

	function userNotExistenceCheckSuccess(userdata, status, xhr) {
		if(userdata.isReg == "1") {
			$store.setItem("currentPage", "sign-up.html");
			$store.setItem("firstAuth", "1");
			$store.setItem("userPhone", $phonenumber.val());
			$store.setItem("password", userdata.password);
			$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./sign-up.html"; });
		} else if(userdata.isReg == "0") {
			$store.setItem("currentPage", "confirmation-code.html");
			$store.setItem("firstAuth", "1");
			$store.setItem("userPhone", $phonenumber.val());
			$store.setItem("password", userdata.password);
			$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./confirmation-code.html"; });
		} else if(userdata.isReg == "") {
			modalAlert("Подтвердите номер!", 3, "На ваш номер телефона был отправлен пароль!", function () {
				$store.setItem("currentPage", "confirmation-code.html");
				$store.setItem("firstAuth", "1");
				$store.setItem("userPhone", $phonenumber.val());
				$store.setItem("password", userdata.password);
				$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./confirmation-code.html"; });
			});
		}
		$('#submit').prop('disabled', false);
	}

	function userExistenceCheckFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!", function () {
			$('#submit').prop('disabled', false);
		});
	}

	function userNotExistenceCheckFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, `Problem with server! ${jqXhr.statusText}`, function () {
			$('#submit').prop('disabled', false);
		});
	}

	$("#submit").bind("click", sendData);

});