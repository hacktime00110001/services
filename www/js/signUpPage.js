$(document).ready(function () {
	if($store.emailConfirmData != undefined) {
		let userdataEmail = JSON.parse($store.emailConfirmData);
		$("#name").val(userdataEmail.name);
		$("#email").val(userdataEmail.email);

		modalEmail(userdataEmail.email, function () {
			$(".pb_close").prop('disabled', true);
			let code = $(".pb_confirm_code").val().replace(/\s/g, '');
			if(code.length < 4) {
				modalAlert("Ошибка ввода данных!", 1, "Код введен не корректно!", function () {
					$(".pb_close").prop('disabled', false);
				});
			} else if(code != userdataEmail.code) {
				modalAlert("Код не подошел!", 2, "Код введен не верно!", function () {
					$(".pb_close").prop('disabled', false);
				});
			} else {
				$(".modal_w_prompt").fadeOut(0);
				$(".modal_w_prompt").remove();
				$.post("http://taxitime.pro/api/SignUp.php", { 
					phonenumber: localStorage.getItem("userPhone"),
					password: localStorage.getItem("password"),
					email: userdataEmail.email,
					name: userdataEmail.name
				}).done(function (data) {
					$store.removeItem('emailConfirmData');
					let userdata = JSON.parse(data);
					$store.clear();
					$store.setItem("userdata", JSON.stringify(userdata));
					modalAlert("Данные подтверждены!", 3, "Регистрация прошла успешно!", function () {
						$('#end_reg').prop('disabled', false);
						$store.setItem("currentPage", "confirm-profile.html");
						$("body").fadeOut(PAGE_DELAY, function () {
							window.location = "./confirm-profile.html";
						});
					});
				}).fail(function(xhr, textStatus, error){
					modalAlert("Server error!", 2, "Problem with server!", function () {
						$('#end_reg').prop('disabled', false);
					});
				});
			}
		}, function () {
			$store.removeItem('emailConfirmData');
			$("#name").val("");
			$("#email").val("");
			$('#end_reg').prop('disabled', false);
		});
	}


	$("#end_reg").click(function () {
		let name = $("#name").val(),
			email = $("#email").val();

		$('#end_reg').prop('disabled', 'true');

		if(name.match("^([А-Я])+([а-я]+)") == null || (name.length <= 1 || name.length >= 20)) {
			modalAlert("Ошибка ввода данных!", 1, "Имя введено не корректно!", function () {
				$('#end_reg').prop('disabled', false);
			});
		} else if(email.match("^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-0-9A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})") == null || (email.length <= 4 || email.length >= 30)) {
			modalAlert("Ошибка ввода данных!", 1, "Email введен не коректно!", function () {
				$('#end_reg').prop('disabled', false);
			});
		} else {
			$.post("http://taxitime.pro/api/SignUp.php", { 
				sendMail: email
			}).done(function (response) {
				$store.emailConfirmData = JSON.stringify({
					"name": name,
					"email": email,
					"code": response
				});
				modalAlert("Данные отправлены!", 3, "Письмо было отправленно на почту! Не забудьте проверить в «Спаме»!", function () {
					modalEmail(email, function () {
						$(".pb_close").prop('disabled', 'true');
						let code = $(".pb_confirm_code").val().replace(/\s/g, '');
						if(code.length < 4) {
							modalAlert("Ошибка ввода данных!", 1, "Код введен не корректно!", function () {
								$(".pb_close").prop('disabled', false);
							});
						} else if(code != response) {
							modalAlert("Код не подошел!", 2, "Код введен не верно!", function () {
								$(".pb_close").prop('disabled', false);
							});
						} else {
							$(".modal_w_prompt").fadeOut(0);
							$(".modal_w_prompt").remove();
							$.post("http://taxitime.pro/api/SignUp.php", { 
								phonenumber: localStorage.getItem("userPhone"),
								password: localStorage.getItem("password"),
								email: email,
								name: name
							}).done(function (data) {
								$store.removeItem('emailConfirmData');
								let userdata = JSON.parse(data);
								$store.clear();
								$store.setItem("userdata", JSON.stringify(userdata));
								modalAlert("Данные подтверждены!", 3, "Регистрация прошла успешно!", function () {
									$('#end_reg').prop('disabled', false);
									$store.setItem("currentPage", "confirm-profile.html");
									$("body").fadeOut(PAGE_DELAY, function () {
										window.location = "./confirm-profile.html";
									});
								});
							}).fail(function(xhr, textStatus, error){
								modalAlert("Server error!", 2, "Problem with server!", function () {
									$('#end_reg').prop('disabled', false);
								});
							});
						}
					}, function () {
						$store.removeItem('emailConfirmData');
						$("#name").val("");
						$("#email").val("");
						$('#end_reg').prop('disabled', false);
					});
				});
				
			}).fail(function(xhr, textStatus, error) {
				modalAlert("Server error!", 2, "Problem with server!", function () {
					$('#end_reg').prop('disabled', false);
				});
			});
		}
	});
});