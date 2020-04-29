let $store = localStorage,
	$session = sessionStorage,
	currentPage = $store.getItem("currentPage"),
	$page = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];

if(currentPage != null && currentPage != $page)
	location.href = "./" + currentPage;
