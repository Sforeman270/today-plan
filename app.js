$(document).ready(function() {
    var $date = $(".date");
    var $inputForm = $(".inputs");
    // fill in these hours
    var hours = ["9 am","10 am", "11 am"];
    var currentHour = moment().format("H");

    $date.text(moment().format("llll"));

    for(var i in hours) {
        var iTime = parseInt(i) + 9;

        var $inputGroupDiv = $("<div>");

        var $input = $("<input>");

        var $hourDiv = $("<div>");

        var $buttonDiv = $("<div>");

        var $saveButton = $("<button>");

        var $saveIcon = $("<i>");

        $inputGroupDiv.addClass("input-group mb-3"); 

        $input.addClass("form-control").attr("type", "text");

        $hourDiv.addClass("input-group-prepend input-group-text").text(hours[i]);

        $buttonDiv.addClass("input-group-append");

        $saveButton.addClass("btn btn-primary saveButton");

        $saveIcon.addClass("material-icons").text("save");

        if(iTime > currentHour) {
            $input.addClass("future");
        }
        else if(iTime < currentHour) {
            $input.addClass("past");
        }
        else {
            $input.addClass("current");
        }

        if(localStorage.getItem(hours[i])) {
            $input.val(localStorage.getItem(hours[i]));
        }

        $saveButton.append($saveIcon);
        $buttonDiv.append($saveButton);
        $inputGroupDiv.append($hourDiv, $input, $buttonDiv);
        $inputForm.append($inputGroupDiv);

    }

    $(document).on("click", ".saveButton", function(e){
        e.preventDefault();

        var inputValue = $(this).parents(".input-group-append").siblings("input").val();
        var inputHour = $(this).parents(".input-group-append").siblings("input-group-text").text();

        localStorage.setItem(inputHour, inputValue);

        
    })
})
