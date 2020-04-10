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
    if(p.innerHTML == "Город") {
        p.classList.add("colorB4B0B0");
    } else {
        p.classList.remove("colorB4B0B0");
    }
}

$(".selectEvent_Date").on("blur", function() {
    $(".selectEvent_DateP").removeClass("colorB4B0B0");
});