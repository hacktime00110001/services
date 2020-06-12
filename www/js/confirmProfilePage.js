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

	$.ajax({
		url: API_CONTROLLERS.PROFILE,
		type: 'POST',
		dataType: 'json',
		data: { getCities : { getCities : true } },
		success: getListOfSitiesSuccess,
		error: getListOfSitiesFail
	});

	function getListOfSitiesSuccess(data, status, xhr) {
		var cities = data.cities;
		cities.forEach((item, key) => {
			if(+key == 0) {
				$("#getCity").html(item);
				$cityList.append(`<option selected>${item}</option>`);
			} else {
				$cityList.append(`<option>${item}</option>`);
			}
		});
	}

	function getListOfSitiesFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!");
	}

	$("#sendData").click(function () {
		$("#sendData").prop('disabled', true);

		let user_profile_data = {}

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

			user_profile_data.city = $city;
			user_profile_data.name = $name;
			user_profile_data.surname = $surname;
			user_profile_data.patronymic = $patronymic;
			user_profile_data.date = $date;
			user_profile_data.driveExp = $driveExp;
			user_profile_data.phonenumber = JSON.parse($store.getItem("userdata")).phonenumber;

			$.ajax({
				url: API_CONTROLLERS.PROFILE,
				type: 'POST',
				dataType: 'json',
				data: { userdata : user_profile_data },
				success: changeUserStatusSuccess,
				error: changeUserStatusFail
			});
		}

		function changeUserStatusSuccess(result, status, xhr) {
			$store.clear();
			$store.setItem("userdata", JSON.stringify(result.userdata));
			modalAlert("Данные успешно обработаны!", 3, "Вы заполнили профиль!", function () {
				$('#sendData').prop('disabled', false);
				$store.setItem("currentPage", "profile.html");
				$("body").fadeOut(APP.PAGE_DELAY, function () { window.location = "./profile.html"; });
			});
		}

		function changeUserStatusFail(jqXhr, textStatus, errorMessage) {
			modalAlert("Server error!", 2, "Problem with server!", function () { $('#sendData').prop('disabled', false); });
		}

	});
});