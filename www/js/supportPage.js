$(document).ready(function () {
	function selectOnFocusOut(thisSelect) {
		parentDiv = thisSelect.parentNode;
		backSelect = parentDiv.children[1];
		img = backSelect.children[1];
		img.classList.remove('transf');
	}

	function selectOnClick(thisSelect) {
		parentDiv = thisSelect.parentNode;
		backSelect = parentDiv.children[1];
		img = backSelect.children[1];
		img.classList.toggle('transf');
	}

	selectEvent = document.getElementsByClassName('selectEvent');
	for(var i = 0; i < selectEvent.length;i++) {
		selectEvent[i].addEventListener("change", selectEventFunc, false);
	}

	function selectEventFunc () {
		parentDiv = this.parentNode;
		backSelect = parentDiv.children[1];
		p = backSelect.children[0];
		p.innerHTML = this.options[this.selectedIndex].text;
	}

	try {
		$("#email").val(JSON.parse($store.getItem("userdata")).email);
	} catch (e) {
		console.log(e); 
	}
	
	if($store.getItem("userdata") != null) {
		$(".selectEvent option[value='1']").remove();
	}

	$(".back_support").click(function () {
		$store.setItem("currentPage", $store.getItem("lastPage"));
		$("body").fadeOut(1000, function () {
			window.location = "./" + $store.getItem("lastPage");
		});
	});

	$("#submit").click(function () {
		let email = $("#email").val(),
			msg = $("#desc_problem").val(),
			reason = $("#selected").text();

		$('#submit').prop('disabled', true);
		if(email.match("^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-0-9A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})") == null || (email.length <= 4 || email.length >= 30)) {
			modalAlert("Ошибка ввода данных!", 1, "Email введен не коректно!", function () {
				$('#submit').prop('disabled', false);
			}); 
		} else if(reason == "Выберите причину") {
			modalAlert("Ошибка ввода данных!", 1, "Вы не выбрали причину!", function () {
				$('#submit').prop('disabled', false);
			}); 
		} else {
			$.post("http://taxitime.pro/api/Support.php", { 
				supportEmail: email,
				supportMsg: msg,
				supportReason: reason
			}).done(function (data) {
				modalAlert("Данные были отправлены!", 3, "Дождитесь ответа от службы поддержки, письмо прийдет на почту : " + email + "!", function () {
					$('#submit').prop('disabled', false);
					$store.setItem("currentPage", $store.getItem("lastPage"));
					$("body").fadeOut(1000, function () {
						window.location = "./" + $store.getItem("lastPage");
					});
				});
			}).fail(function(xhr, textStatus, error){
				modalAlert("Server error!", 2, "Problem with server!", function () {
					$('#submit').prop('disabled', false);
					$store.setItem("currentPage", $store.getItem("lastPage"));
					$("body").fadeOut(1000, function () {
						window.location = "./" + $store.getItem("lastPage");
					});
				});
			});
		}
	});
});