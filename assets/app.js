var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
	// create elements that make up a task item
	var taskLi = $("<li>").addClass("list-group-item");
	var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(taskDate);

	var taskP = $("<p>").addClass("m-1").text(taskText);

	// append span and p element to parent li
	taskLi.append(taskSpan, taskP);

	// check due date
	auditTask(taskLi);

	// append to ul list on the page
	$("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
	tasks = JSON.parse(localStorage.getItem("tasks"));

	// if nothing in localStorage, create a new object to track all task status arrays
	if (!tasks) {
    console.log(tasks[status][index]);
		tasks = {
			toDo: [],
			inProgress: [],
			inReview: [],
      done: []
      
		};
		tasks[status][index].text = text;
		saveTasks();
	}

	// loop over object properties
	$.each(tasks, function(list, arr) {
		// then loop over sub-array
		arr.forEach(function(task) {
			createTask(task.text, task.date, list);
		});
	});
};

var saveTasks = function() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
};

$(".list-group").on("click", "p", function() {
	var text = $(this).text().trim();

	$('.list-group').on('blur', 'textarea', function() {
		var text = $(this).val().trim();

		var status = $(this).closest('.list-group').attr('id').replace('list-', '');

		var index = $(this).closest('.list-group-item').index();
	});

	$("#trash").droppable({
		accept: ".card .list-group-item",
		tolerance: "touch",
		drop: function(event, ui) {
			ui.draggable.remove();
		},
		over: function(event, ui) {},
		out: function(event, ui) {}
	});

	$(".card .list-group").sortable({
		connectWith: $(".card .list-group"),
		scroll: false,
		tolerance: "pointer",
		helper: "clone",
		activate: function(event) {
			console.log("activate", this);
		},
		deactivate: function(event) {
			console.log("deactivate", this);
		},
		over: function(event) {
			console.log("over", event.target);
		},
		out: function(event) {
			console.log("out", event.target);
		},
		update: function(event) {
			var tempArr = [];
			$(this).children().each(function() {
				var arrName = $(this).attr("id").replace("list-", "");

				tasks[arrName] = tempArr;
				saveTasks();

				var text = $(this).find("p").text().trim();

				var date = $(this).find("span").text().trim();

				tempArr.push({
					text: text,
					date: date
				});
			});
		}
	});

	var textInput = $("<textarea>").addClass("form-control").val(text);

	$(this).replaceWith(textInput);
	textInput.trigger("focus");

	var taskP = $("<p>").addClass("m-1").text(text);

	$(this).replaceWith(taskP);
});

// due date was clicked
$(".list-group").on("click", "span", function() {
	// get current text
	var date = $(this).text().trim();

	// create new input element
  var dateInput = $("<input>").attr("type", "text").addClass("form-control").val(date);
  
// swp out elements
	$(this).replaceWith(dateInput);

	// enable jquery ui datepicker
	dateInput.datepicker({
		minDate: 1,
		onClose: function() {
			// when calendar is closed, force a "change event on the 'dateInput'
			$(this).trigger("change");
		}
	});

	// automatically bring up the calendar
	dateInput.trigger("focus");

	// value of due date was changed
	$(".list-group").on("change", "input[type='text']", function() {
		var date = $(this).val().trim();

    var status = $(this).closest(".list-group").attr("id").replace(".list-", "");
    console.log(status);

    var index = $(this).closest(".list-group-item").index();
    console.log(index);

    tasks[status][index] = date;
    console.log(date);
		saveTasks();

		var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(date);
		$(this).replaceWith(taskSpan);

		// Pass task's <li> element into auditTask() to check new due date
		auditTask($(taskSpan).closest(".list-group-item"));
	});

	// create new input element
	var dateInput = $("<input>").attr("type", "text").addClass("form-control").val(date);

	// swap out elements
	$(this).replaceWith(dateInput);

	// automatically focus on new element
	dateInput.trigger("focus");
});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
	// clear values
	$("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
	// highlight textarea
	$("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
	// get form values
	var taskText = $("#modalTaskDescription").val();
	var taskDate = $("#modalDueDate").val();

	if (taskText && taskDate) {
		createTask(taskText, taskDate, "toDo");

		// close modal
		$("{#task-form-modal}").modal("hide");

		// save in tasks array
		tasks.toDo.push({
			text: taskText,
			date: taskDate
		});

		saveTasks();
	}
});

// remove all tasks
$("#remove-tasks").on("click", function() {
	for (var key in tasks) {
		tasks[key].length = 0;
		$("#list-" + key).empty();
	}
	saveTasks();
});

$("#modalDueDate").datepicker({
	minDate: 1
});

var auditTask = function(taskEl) {
	// get date from task element
	var date = $(taskEl).find("span").text().trim();
	// ensure it worked
	console.log(date);

	// convert to moment object at 5:00pm
	var time = moment(date, "L").set("hour", 17);

	// remove any old classes from element
	$(taskEl).removeClass("list-group-item-warning list-group-item-danger");

	// apply new class if task is near/over due date
	if (moment().isAfter(time)) {
		$(taskEl).addClass("list-group-item-danger");
	} else if (Math.abs(moment().diff(time, "days")) <= 2) {
		$(taskEl).addClass("list-group-item-warning");
	}
};

// load tasks for the first time
loadTasks();


setInterval(function () {
  $(".card .list-group-item").each(function (el) {
    auditTask(el);
  });
},(1000 * 60) * 30);
