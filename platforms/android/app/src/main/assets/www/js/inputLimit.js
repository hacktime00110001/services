$(".addProfile_Input_Small").on("input", function() {
    var experience = +$(".addProfile_Input_Small").val();
    var expWord = $(".expWord");
   	if(experience % 10 == 1 && experience != 11) 
        expWord.text("год");
    else if((experience % 10 > 1 && experience % 10 < 5 && experience < 10) || (experience % 10 > 1 && experience % 10 < 5 && experience > 20))
        expWord.text("года");
    else 
        expWord.text("лет");
});