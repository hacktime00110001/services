$(document).ready(function() {

	var $phonenumber = $("#phonenumber"),
		$store = localStorage;

	$phonenumber.mask("+7 000 000 00 00");

	$phonenumber.keyup(function(event) {
		event.preventDefault();
		if (event.keyCode === 13)
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
					location.href = "./confirmation-code.html";
				} else {
					$.post("http://taxitime.pro/api/SignUp.php", { 
						sendPhone : $phonenumber.val() 
					}).done(function (dataSignUp) {
						var data = dataSignUp.split(";");
						if(data[0] == "1") {
							$store.setItem("currentPage", "sign-up.html");
							$store.setItem("firstAuth", "1");
							$store.setItem("userPhone", $phonenumber.val());
							$store.setItem("password", data[1]);
							location.href = "./sign-up.html";
						} else {
							modal_alert("Подтвердите номер!", 3, "На ваш номер телефона был отправлен пароль!", function () {
								$store.setItem("currentPage", "confirmation-code.html");
								$store.setItem("firstAuth", "1");
								$store.setItem("userPhone", $phonenumber.val());
								$store.setItem("password", data[1]);
								location.href = "./confirmation-code.html";
							});
						}
						$('#submit').prop('disabled', false);
					}).fail(function(xhr, textStatus, error) {
						modal_alert("Server error!", 2, "xhr.statusText: " + xhr.statusText + "<br>textStatus: " + textStatus + "<br>error: " + error + "<br>", function () {
							$('#submit').prop('disabled', false);
						});
					});
				}
				$('#submit').prop('disabled', false); 
			}).fail(function(xhr, textStatus, error){
				modal_alert("Server error!", 2, "xhr.statusText: " + xhr.statusText + "<br>textStatus: " + textStatus + "<br>error: " + error + "<br>", function () {
					$('#submit').prop('disabled', false);
				});
			});
		} else {
			modal_alert("Ошибка ввода данных", 2, "Номер телефона введен не корректно!", function () {
				$('#submit').prop('disabled', false);
			});
		}
	}

	$("#submit").bind("click", sendData);
	
});