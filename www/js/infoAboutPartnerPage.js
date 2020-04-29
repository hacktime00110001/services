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

	$.post("http://taxitime.pro/api/MainData.php", { 
		getInfoAboutPartner: $store.getItem("lastVisitPartner"),
		agregastorId: $store.getItem("lastVisitAgregator")
	}).done(function (data) {
		let partnerData = JSON.parse(data);

		$("#title_of_page").html(partnerData[0].name);
		$("#title_of_partner").html(partnerData[1][0].name);
		$("#reting").html(partnerData[1][0].rating);
		$("#short_desc").html(partnerData[1][0].short_desc);

		$agregatorsContent = $("#agregatorBox_agregatorsList");
		for(j = 0; j < partnerData[1][0][1].some_info_agregators.length; j++)
			$agregatorsContent.append("<div class='col20pr'><img src='"+partnerData[1][0][1].some_info_agregators[j].logo_url+"' alt='"+partnerData[1][0][1].some_info_agregators[j].name+"'></div>");
		
		$workCondContent = $("#work_cond");
		$workCondContent.append(partnerData[1][0].work_condition);

		$chanelsContent = $("#support_channels");
		for(j = 0; j < partnerData[1][0][0].support_channels.length; j++)
			$chanelsContent.append("<img src='"+partnerData[1][0][0].support_channels[j].logo_url+"' alt='"+partnerData[1][0][0].support_channels[j].name+"'>");

		$parkCarContent = $("#park_car_content");
		$parkCarData = partnerData[1][0].park_cars.split(";").filter(a => a != "");
		if($parkCarData[0] != "none") {
			for(j = 0; j < $parkCarData.length; j++) {
				if(j != $parkCarData.length - 1)
					$parkCarContent.append("<span>Марка </span> "+$parkCarData[j]+'<span>, </span>');
				else 
					$parkCarContent.append("<span>Марка </span> "+$parkCarData[j]);
			}
		} else {
			$parkCarContent.append("Отсутствуют");
		}

		retingUpdate();

	}).fail(function(xhr, textStatus, error) {
		modalAlert("Server error!", 2, "Problem with server!");
	});
});