$(document).ready(function() {

	let $phonenumber = $("#phonenumber");

	$phonenumber.mask("+7 000 000 00 00");

	$phonenumber.keyup(function(e) {
		e.preventDefault();
		if (e.keyCode === 13)
			sendData();
		if($phonenumber.val().length < 4)
			$phonenumber.val("+7 ");
	});

	function sendData () {
		$('#submit').prop('disabled', 'true');
		if($phonenumber.val().length == 16) {
			$.post("http://taxitime.pro/api/SignIn.php", { 
				sendPhone : $phonenumber.val() 
			}).done(function (dataSignIn) {
				if(dataSignIn.length > 1) {
					$store.setItem("currentPage", "confirmation-code.html");
					$store.setItem("firstAuth", "0");
					$store.setItem("userPhone", $phonenumber.val());
					$store.setItem("password", dataSignIn);
					$("body").fadeOut(1000, function () {
						window.location = "./confirmation-code.html";
					});
				} else {
					$.post("http://taxitime.pro/api/SignUp.php", { 
						sendPhone : $phonenumber.val()
					}).done(function (dataSignUp) {
						let data = JSON.parse(dataSignUp);
						if(data[0].isReg == "1") {
							$store.setItem("currentPage", "sign-up.html");
							$store.setItem("firstAuth", "1");
							$store.setItem("userPhone", $phonenumber.val());
							$store.setItem("password", data[0].password);
							$("body").fadeOut(1000, function () {
								window.location = "./sign-up.html";
							});
						} else if(data[0].isReg == "0") {
							$store.setItem("currentPage", "confirmation-code.html");
							$store.setItem("firstAuth", "0");
							$store.setItem("userPhone", $phonenumber.val());
							$store.setItem("password", data[0].password);
							$("body").fadeOut(1000, function () {
								window.location = "./confirmation-code.html";
							});
						} else if(data[0].isReg == "") {
							modalAlert("Подтвердите номер!", 3, "На ваш номер телефона был отправлен пароль!", function () {
								$store.setItem("currentPage", "confirmation-code.html");
								$store.setItem("firstAuth", "1");
								$store.setItem("userPhone", $phonenumber.val());
								$store.setItem("password", data[0].password);
								$("body").fadeOut(1000, function () {
									window.location = "./confirmation-code.html";
								});
							});
						}
						$('#submit').prop('disabled', false);
					}).fail(function(xhr, textStatus, error) {
						modalAlert("Server error!", 2, "Problem with server! ["+error+"]", function () {
							$('#submit').prop('disabled', false);
						});
					});
				}
				$('#submit').prop('disabled', false); 
			}).fail(function(xhr, textStatus, error) {
				modalAlert("Server error!", 2, "Problem with server! ["+error+"]", function () {
					$('#submit').prop('disabled', false);
				});
			});
		} else {
			modalAlert("Ошибка ввода данных", 2, "Номер телефона введен не корректно!", function () {
				$('#submit').prop('disabled', false);
			});
		}
	}

	$("#submit").bind("click", sendData);
	
});