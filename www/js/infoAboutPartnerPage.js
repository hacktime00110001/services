$(document).ready(function () {
	let $store = localStorage;

	function retingUpdate() {
		let $high = "agrBox_rateGreen",
			$medium = "agrBox_rateYellow",
			$low = "agrBox_rateRed";

		let $retingsBlock = document.querySelectorAll(".reting"),
			$parents = document.querySelectorAll(".agregatorBox_rating");

		for(q = 0; q < $retingsBlock.length; q++) {
			$reting = parseFloat($retingsBlock[q].innerHTML);
			if($reting >= 4.5 && $reting <= 5.0)
				$parents[q].classList.add($high);
			else if($reting >= 4.0 && $reting < 4.5)
				$parents[q].classList.add($medium);
			else 
				$parents[q].classList.add($low);
		}
	}

	$.ajax({
		url: API_CONTROLLERS.MAIN_DATA,
		type: 'POST',
		dataType: 'json',
		data: { getInfoAboutPartner : { "agregator_id": $store.getItem("lastVisitAgregator"), "partner_id": $store.getItem("lastVisitPartner") } },
		success: parnterInfoLoadSuccess,
		error: parnterInfoLoadFail
	});

	function parnterInfoLoadSuccess(partnerdata, status, xhr) {

		$("#title_of_page").html(partnerdata.name);
		$("#title_of_partner").html(partnerdata.name);
		$("#reting").html(partnerdata.rating);
		$("#short_desc").html(partnerdata.short_desc);

		$agregatorsContent = $("#agregatorBox_agregatorsList");
		$agregatorsConnectedArr = partnerdata.connected_agregators;
		for(j = 0; j < $agregatorsConnectedArr.length; j++)
			$agregatorsContent.append(`
				<div class='col20pr'>
					<img src="${$agregatorsConnectedArr[j].logo_url}" alt="${$agregatorsConnectedArr[j].name}">
				</div>
			`);

		$workCondContent = $("#work_cond");
		$("#work_cond").append(partnerdata.work_condition);
		

		$chanelsContent = $("#support_channels");
		$channelsDataArr = partnerdata.support_chanels;
		for(j = 0; j < $channelsDataArr.length; j++)
			$chanelsContent.append(`
				<img src="${$channelsDataArr[j].logo_url}" alt="${$channelsDataArr[j].name}">
			`);

		$parkCarContent = $("#park_car_content");
		$parkCarData = partnerdata.park_cars.split(";").filter(a => a != "");
		if($parkCarData[0] != "none") {
			for(j = 0; j < $parkCarData.length; j++) {
				if(j != $parkCarData.length - 1)
					$parkCarContent.append(`<span>Марка </span> ${$parkCarData[j]}<span>, </span>`);
				else 
					$parkCarContent.append(`<span>Марка </span> ${$parkCarData[j]}`);
			}
		} else {
			$parkCarContent.append("Отсутствуют");
		}

		retingUpdate();
	}

	function parnterInfoLoadFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, `Problem with server!`);
	}



	$("#connectToParnter").click(function () {
		$.ajax({
			url: API_CONTROLLERS.DEALS,
			type: 'POST',
			dataType: 'json',
			data: { deals : { driverId: JSON.parse($store.getItem("userdata")).id, partnerId: $store.getItem("lastVisitPartner") } },
			success: sendOfferSuccess,
			error: psendOfferFail
		});
	});

	function sendOfferSuccess(dealResponse, status, xhr) {
		$("#connectToParnter").prop("disabled", true);

		if(dealResponse.result == "Success create") {
			modalAlert("Спасибо!", 3, "Ваша заявка отправлена. С Вами свяжутся в кратчайшие сроки чтобы обсудить детали.", function () {
				$("#connectToParnter").prop("disabled", false);
			});
		} else if(dealResponse.result == "Record isset") {
			modalAlert("Спасибо!", 0, "Ваша заявка находится в обработке, С Вами свяжутся в кратчайшие сроки чтобы обсудить детали.", function () {
				$("#connectToParnter").prop("disabled", false);
			});
		} else if(dealResponse.result == "Delay") {
			modalAlert("Спасибо!", 1, "Для отправки следующей заявки вам нужно пододжать 1 минуту!", function () {
				$("#connectToParnter").prop("disabled", false);
			});
		} else {
			modalAlert("Server error!", 2, "Problem with server!", function () {
				$("#connectToParnter").prop("disabled", false);
			});
		}
	}

	function psendOfferFail(jqXhr, textStatus, errorMessage) {
		modalAlert("Server error!", 2, "Problem with server!", function () { $("#connectToParnter").prop("disabled", false); });
	}

});