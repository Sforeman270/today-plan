$(document).ready(function() {
    var $date = $(".date");
    var $inputForm = $(".inputs");
    
    var hours = ["9 am","10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm", "4 pm","5 pm"];
    var currentHour = moment().format("H");

    $date.text(moment().format("llll"));

    for(var i in hours) {
        var iTime = parseInt(i) + 9;

        var $inputGroupDiv = $("<div>");

        var $input = $("<input>");

        var $hourDiv = $("<div>");

        var $buttonDiv = $("<div>");

        var $saveBtn = $("<button>");

        var $saveIcon = $("<i>");

        $inputGroupDiv.addClass("input-group mb-3 textarea row no-gutters description"); 

        $input.addClass("form-control textarea row no-gutters description").attr("type", "text");

        $hourDiv.addClass("input-group-prepend input-group-text hour float-left").text(hours[i]);

        $buttonDiv.addClass("input-group-append");

        $saveBtn.addClass("btn btn-info saveBtn saveBtn i:hover");

        $saveIcon.addClass("material-icons").text("save");

        if(iTime > currentHour) {
            $input.addClass("future");
        }
        else if(iTime < currentHour) {
            $input.addClass("past");
        }
        else {
            $input.addClass("present");
        }

        if(localStorage.getItem(hours[i])) {
            $input.val(localStorage.getItem(hours[i]));
        }

        $saveBtn.append($saveIcon);
        $buttonDiv.append($saveBtn);
        $inputGroupDiv.append($hourDiv, $input, $buttonDiv);
        $inputForm.append($inputGroupDiv);

    }
    
    $(document).on("click", ".saveBtn", function(e){
        e.preventDefault();

        var inputValue = $(this).parents(".input-group-append").siblings("input").val();
        var inputHour = $(this).parents(".input-group-append").siblings("input-group-text").text();

        localStorage.setItem(inputHour, inputValue);

        
    })
})
