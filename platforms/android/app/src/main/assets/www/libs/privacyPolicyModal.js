modal = document.getElementsByClassName('confidentiality')[0];
modal.style.display = 'none';

function confidentialityOpen() { 
	modal.style.display = 'block'; 
}

function confidentialityClose() { 
	modal.style.display = 'none'; 
}

function logincheckboxCheck (inp) { 
	inp.parentElement.classList.toggle("checkboxOff");inp.parentElement.classList.toggle("checkboxOn"); 
}
