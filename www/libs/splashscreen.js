$(window).on("load", function () {

	window.toBoolean = function(string) {
	    switch(string.toLowerCase().trim()){
	        case "true": case "yes": case "1": return true;
	        case "false": case "no": case "0": 
	        case null: return false;
	        default: return Boolean(string);
	    }
	}

	if($session.isFirstEnter == undefined)
		$session.isFirstEnter = true;
	else 
		$session.isFirstEnter = false;

	if(toBoolean($session.isFirstEnter)) {
		$("#splashscreen").css("display", "flex");
		$("body").css("overflow", "hidden");
		$("#splashscreen").delay(1000).fadeOut(APP.SPLASHSCREEN_DELAY);
		$("header").delay(1000 + APP.SPLASHSCREEN_DELAY).fadeIn(APP.SPLASHSCREEN_DELAY);
		$("main").delay(1000 + APP.SPLASHSCREEN_DELAY).fadeIn(APP.SPLASHSCREEN_DELAY);
		$("body").css("overflow", "auto");
	} else {
		$("#splashscreen").remove();
		$("header").fadeIn(1000);
		$("main").fadeIn(1000);
	}
});