$(document).ready(function() {
	let seconds = 179,
		firstAuth = $store.getItem("firstAuth");
		
	if(firstAuth === "1") {
		$(".numberLogo").before("<div class='num_info_for_users'>На номер <span id='user_entered_pn's>+7 000 000 00 00</span> было отправленно сообщение!</div>");
		$("#user_entered_pn").text($store.getItem("userPhone"));
		$(".codeInfo").after("<div class='request_in_support'>Если номер телефона введен неверно вы можете <span id='correct_pn'>исправить номер</span> или обратится в <span id='request_in_support'>службу поддержки</span></div>");
		
		$.post("http://taxitime.pro/api/SignUp.php", { 
			checkCountsOfTry : $store.getItem("userPhone")
		}).done(function (countOfTry) {
			if(countOfTry != "2") {
				intervalToNextAttempt = setInterval(function () {
					if(seconds != -1) {
						if(seconds % 60 > 9) {
							$("#next_attempt").text("0"+ parseInt(seconds / 60) +":"+ (seconds-- % 60) );
						} else {
							$("#next_attempt").text("0"+ parseInt(seconds / 60) +":0"+ (seconds-- % 60) );
						}
					} else {
						clearInterval(intervalToNextAttempt);
						$(".codeInfo").empty();
						$(".codeInfo").html("<b><span id='one_attempt'>Отправить код еще раз!</span></b>");
					}
				}, 1000);
			} else {
				$(".codeInfo").empty();
				$(".codeInfo").html("<p class='codeInfoAfter'>Вы исчерпали попытки!</p>");
			}
		}).fail(function(xhr, textStatus, error){
			modalAlert("Server error!", 2, "Problem with server!");
		});
	} else if(firstAuth === "0") {
		$(".codeInfo").after("<div class='request_in_support'>Если номер телефона введен неверно вы можете <span id='correct_pn'>исправить номер</span> или обратится в <span id='request_in_support'>службу поддержки</span></div>");
		$(".codeInfo").empty();
		$(".codeInfo").html("<b><span id='forgot_password'>Забыли пароль?</span></b>");
	} else {
 		$("body").fadeOut(1000, function () {
			window.location = "./sign-in.html";
		});
	}

	$('#conf-code').pinlogin({
		fields: 6,
		hideinput: false,
		reset: true,
		complete: function(pin) {
			$.post("http://taxitime.pro/api/SignUp.php", { 
				checkUserEnterPin : pin 
			}).done(function (encPin) {
				if(encPin == $store.getItem("password") && firstAuth != "1") {
					modalAlert("Информация!", 0, "Вы успешно авторизовались!");
					$(".mb_close").click(function () {
						$.post("http://taxitime.pro/api/SignIn.php", { 
							signIn : $store.getItem("userPhone")
						}).done(function (data) {
							let userdata = JSON.parse(data);
							$store.clear();
							$store.setItem("userdata", JSON.stringify(userdata));
							if(userdata.status == "0") {
								$store.setItem("currentPage", "confirm-profile.html");
								$("body").fadeOut(1000, function () {
									window.location = "./confirm-profile.html";
								});
							} else {
								$store.setItem("currentPage", "profile.html");
								$("body").fadeOut(1000, function () {
									window.location = "./profile.html";
								});
							}
						}).fail(function(xhr, textStatus, error) {
							modalAlert("Server error!", 2, "Problem with server!");
						});
					});
				} else if(encPin == $store.getItem("password") && firstAuth === "1") {
					$.post("http://taxitime.pro/api/SignUp.php", { 
						updateIsReg : $store.getItem("userPhone")
					}).done(function (data) {
						$store.setItem("currentPage", "sign-up.html");
						$("body").fadeOut(1000, function () {
							window.location = "./sign-up.html";
						});
					}).fail(function(xhr, textStatus, error){
						modalAlert("Server error!", 2, "Problem with server!");
					});
				} else {
					modalAlert("Предупреждение!", 1, "Код введен не верно, попробуйте снова!");
				}
			});
		}
	});

	$(document).on('click','#one_attempt',function(){
		$(".codeInfo").empty();
		$(".codeInfo").html("<p class='codeInfoAfter'>Код был отправлен!</p>");
		$.post("http://taxitime.pro/api/SignUp.php", { 
			updateCountOfTry : $store.getItem("userPhone"),
		}).done(function (newPassword) {
			$store.setItem("password", newPassword);
			modalAlert("Информация", 3, "Код был отправлен!");
		}).fail(function(xhr, textStatus, error){
			modalAlert("Server error!", 2, "Problem with server!");
		});
	});

	$(document).on('click','#forgot_password',function(){
		$(".codeInfo").empty();
		$(".codeInfo").html("<p class='codeInfoAfter'>Пароль был отправлен!</p>");
		$.post("http://taxitime.pro/api/SignIn.php", {
			forgotPassword : $store.getItem("userPhone")
		}).done(function (newPassword) {
			$store.setItem("password", newPassword);
			modalAlert("Информация", 3, "Пароль был отпарвлен на почту привязанную к этому номеру телефона! Не забудьте проверить в «Спаме»!");
		}).fail(function(xhr, textStatus, error){
			modalAlert("Server error!", 2, "Problem with server!");
		});
	});

	$("#correct_pn").click(function () {
		window.localStorage.clear();
		modalAlert("Предупреждение", 1, "Введите номер телефона заново, будьте внимательнее :)", function () {
			$store.setItem("currentPage", "sign-in.html");
			$("body").fadeOut(1000, function () {
				window.location = "./sign-in.html";
			});
		});
	});

    $("#request_in_support").click(function () {
        $store.setItem("currentPage", "support.html");
        $store.setItem("lastPage", "sign-in.html");
        $("body").fadeOut(1000, function () {
			window.location = "./support.html";
		});
    });

});
