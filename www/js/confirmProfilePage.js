$(document).ready(function () {

	$(".selectEvent_Date").on("blur", function() {
		$(".selectEvent_DateP").removeClass("colorB4B0B0");
	});

	$(".addProfile_Input_Small").on("input", function() {
		let experience = +$(".addProfile_Input_Small").val(),
			expWord = $(".expWord");
			
		if(experience % 10 == 1 && experience != 11) 
			expWord.text("год");
		else if((experience % 10 > 1 && experience % 10 < 5 && experience < 10) || (experience % 10 > 1 && experience % 10 < 5 && experience > 20))
			expWord.text("года");
		else 
			expWord.text("лет");
	});

	$("#name").val(JSON.parse($store.getItem("userdata")).name); 

	let $cityList = $("#selectCat");

	$.post("http://taxitime.pro/api/Profile.php", { 
		getCities: true
	}).done(function (data) {
		var cities = data.split(",");
		for(var i = 0; i < cities.length; i++) {
			if(i == 0) {
				$("#getCity").html(cities[i]);
				$cityList.append(`<option selected>${cities[i]}</option>`);
			} else {
				$cityList.append(`<option>${cities[i]}</option>`);
			}
		}
	}).fail(function(xhr, textStatus, error){
		modalAlert("Server error!", 2, "Problem with server!");
	});

	$("#sendData").click(function () {
		$("#sendData").prop('disabled', true);

		let $city = $("#getCity").text(),
			$name = $("#name").val(),
			$surname = $("#surname").val(),
			$patronymic = $("#patronymic").val(),
			$day = +$("#day").val(),
			$month = $("#month").text(),
			$year = +$("#year").val(),
			$driveExp = +$("#exp").val();

		if($city == "Город") {
			modalAlert("Ошибка ввода данных!", 1, "Вы не выбрали город!", function () {
				$('#sendData').prop('disabled', false);
			}); 
		} else if($name.length < 2 || $name.length > 20 || $name.match("^([А-Я])+([а-я]+)") == null) {
			modalAlert("Ошибка ввода данных!", 1, "Имя введено не коректно!", function () {
				$('#sendData').prop('disabled', false);
			});
		} else if($surname.length < 2 || $surname.length > 20 || $surname.match("^([А-Я])+([а-я]+)") == null) {
			modalAlert("Ошибка ввода данных!", 1, "Фамилия введена неверно!", function () {
				$('#sendData').prop('disabled', false);
			});
		} else if($day < 1 || $day > 31) {
			modalAlert("Ошибка ввода данных!", 1, "День рождения введён не коректно!", function () {
				$('#sendData').prop('disabled', false);
			});    
		} else if($year < 1900 || $year > 2002) {
			modalAlert("Ошибка ввода данных!", 1, "Год рождения введён не коректно!", function () {
				$('#sendData').prop('disabled', false);
			});    
		} else if($driveExp < 1 || $driveExp > 70) {
			modalAlert("Ошибка ввода данных!", 1, "Стаж вождения введён не коректно!", function () {
				$('#sendData').prop('disabled', false);
			});    
		} else {
			let $date = $day + " " + $month + " " + $year;
			$driveExp = $driveExp + " " + $(".expWord").text();

			$.post("http://taxitime.pro/api/Profile.php", { 
				city: $city,
				name: $name,
				surname: $surname,
				patronymic: $patronymic,
				date: $date,
				driveExp: $driveExp,
				phonenumber: JSON.parse($store.getItem("userdata")).phonenumber
			}).done(function (data) {
				let userdata = JSON.parse(data);
				$store.clear();
				$store.setItem("userdata", JSON.stringify(userdata));
				modalAlert("Данные успешно обработаны!", 3, "Вы заполнили профиль!", function () {
					$('#sendData').prop('disabled', false);
					$store.setItem("currentPage", "profile.html");
					$("body").fadeOut(1000, function () {
						window.location = "./profile.html";
					});
				}); 
			}).fail(function(xhr, textStatus, error){
				modalAlert("Server error!", 2, "Problem with server!", function () {
					$('#sendData').prop('disabled', false);
				});
			});
		}

	});
});